export default function removeTrailingSlash(url) {
    if (url.endsWith('/')) return url.slice(0, -1); // Remove the trailing slash
    return url; // No trailing slash found, return the URL as is
}
