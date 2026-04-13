/**
 * Função utilitária para prevenir ataques de Cross-Site Scripting (XSS).
 * Escapa os caracteres HTML sensíveis das strings inseridas pelos utilizadores
 * antes destas serem injetadas no DOM via innerHTML.
 *
 * @param {string} str - A string que contém ou pode conter conteúdo malicioso.
 * @returns {string} - A string devidamente sanitizada.
 */
export function escapeHTML(str) {
    if (!str) return "";
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
