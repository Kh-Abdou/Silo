import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Resource } from '@/types/resource';

/**
 * Sanitizes a string for safe filename or folder usage.
 * Replaces characters like $ / \ : * ? " < > | with _
 */
function sanitize(name: string): string {
    return name.replace(/[$\/\\:*"<>|?]/g, '_').trim() || 'untitled';
}

/**
 * Escapes values for CSV format (quotes and double quotes for internal quotes).
 */
function escapeCSV(val: string | null | undefined): string {
    if (!val) return '""';
    // Remove newlines and escape quotes
    const clean = val.replace(/\n/g, ' ').replace(/"/g, '""');
    return `"${clean}"`;
}

/**
 * Guesses extension from a mime type.
 */
function getExtensionFromMime(mime: string): string {
    const mimeMap: Record<string, string> = {
        'application/pdf': 'pdf',
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'text/plain': 'txt',
        'text/markdown': 'md',
        'text/html': 'html',
        'application/zip': 'zip',
        'application/x-zip-compressed': 'zip',
        'application/octet-stream': 'bin',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/json': 'json',
    };
    return mimeMap[mime] || 'file';
}

/**
 * Extracts extension and blob from a fileUrl.
 */
async function getFileBlobAndExt(url: string): Promise<{ blob: Blob; ext: string }> {
    if (url.startsWith('data:')) {
        const parts = url.split(',');
        const match = parts[0]?.match(/:(.*?);/);
        const mime = match?.[1] || 'application/octet-stream';
        const response = await fetch(url);
        const blob = await response.blob();
        return { blob, ext: getExtensionFromMime(mime) };
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();

    let ext = url.split('.').pop()?.split(/[?#]/)[0] || '';
    if (!ext || ext.length > 5) {
        ext = getExtensionFromMime(blob.type);
    }

    return { blob, ext };
}

/**
 * Generates a professional ZIP file following the "Single Source" rule.
 * Organized by the first tag, with folder sanitization and a CSV index.
 */
export async function generateResourceZip(resources: Resource[]) {
    const zip = new JSZip();

    // Header for the manifest CSV
    let csvContent = "\ufeff"; // BOM for Excel UTF-8 support
    csvContent += '"Titre";"Tags";"URL d\'origine";"Chemin dans le ZIP"\n';

    // Track written paths to avoid collisions
    const usedPaths = new Set<string>();

    for (const res of resources) {
        // --- RULE: SINGLE LOCATION ---
        // Use only the first tag as the folder name.
        const firstTag = res.tags?.[0]?.name || "_Unsorted";
        const folderName = sanitize(firstTag);
        const folder = zip.folder(folderName);
        if (!folder) continue;

        let baseName = sanitize(res.title || 'resource');
        let finalPathInZip = "";

        // Function to get a unique path
        const getUniquePath = (name: string, ext: string): string => {
            let attempt = `${name}.${ext}`;
            let counter = 1;
            let fullAttemptPath = `${folderName}/${attempt}`;
            while (usedPaths.has(fullAttemptPath)) {
                attempt = `${name}_${counter++}.${ext}`;
                fullAttemptPath = `${folderName}/${attempt}`;
            }
            return attempt;
        };

        // 1. Handle Attachment (PDF, Image, etc.)
        if (res.fileUrl) {
            try {
                const { blob, ext } = await getFileBlobAndExt(res.fileUrl);
                const fileName = getUniquePath(baseName, ext);

                folder.file(fileName, blob);
                finalPathInZip = `${folderName}/${fileName}`;
                usedPaths.add(finalPathInZip);
            } catch (error) {
                console.error(`Error exporting file for ${res.title}:`, error);
            }
        }

        // 2. Handle URL Shortcut (if it's a link or content is a URL)
        const url = res.url || (res.content?.startsWith("http") ? res.content : null);
        if (url && url.startsWith("http")) {
            const urlFileName = getUniquePath(baseName, "url");
            const urlFileContent = `[InternetShortcut]\nURL=${url}\n`;
            folder.file(urlFileName, urlFileContent);

            const fullPath = `${folderName}/${urlFileName}`;
            if (!finalPathInZip) finalPathInZip = fullPath;
            usedPaths.add(fullPath);
        }

        // 3. Handle Content/Note as Text File
        const hasContent = res.content && !res.content.startsWith("http");
        const hasNote = res.userNote && res.userNote.trim().length > 0;

        if (hasContent || hasNote) {
            const noteFileName = getUniquePath(`${baseName}_Note`, "txt");
            let textFileContent = "";
            if (hasContent) textFileContent += `CONTENT:\n${res.content}\n\n`;
            if (hasNote) textFileContent += `NOTE:\n${res.userNote}\n`;

            folder.file(noteFileName, textFileContent.trim());

            const fullPath = `${folderName}/${noteFileName}`;
            if (!finalPathInZip) finalPathInZip = fullPath;
            usedPaths.add(fullPath);
        }

        // --- MANIFEST ENTRY ---
        const allTags = res.tags ? res.tags.map(t => t.name).join(', ') : "";
        csvContent += [
            escapeCSV(res.title),
            escapeCSV(allTags),
            escapeCSV(url || ""),
            escapeCSV(finalPathInZip || `${folderName}/`)
        ].join(';') + "\n";
    }

    // Add the manifest to the root of the ZIP
    zip.file("_Silo_Index.csv", csvContent);

    // Finalize and download
    const blob = await zip.generateAsync({ type: "blob" });
    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `Silo-Export-${timestamp}.zip`);
}
