function lengthOfLongestSubstring(s) {
    let inicio = 0;
    let maxLongitud = 0;
    let caracteres = new Set();

    for (let fin = 0; fin < s.length; fin++) {
        while (caracteres.has(s[fin])) {
            // Si el carácter en "fin" ya existe en el conjunto,
            // movemos el inicio de la ventana hacia la derecha.
            caracteres.delete(s[inicio]);
            inicio++;
        }

        // Expandimos la ventana hacia la derecha.
        caracteres.add(s[fin]);

        // Actualizamos la longitud máxima si es necesario.
        maxLongitud = Math.max(maxLongitud, fin - inicio + 1);
    }

    return maxLongitud;
}

// Ejemplos
console.log(lengthOfLongestSubstring("abcabcbb"));  // Output: 3
console.log(lengthOfLongestSubstring("bbbbb"));     // Output: 1
console.log(lengthOfLongestSubstring("pwwkew"));    // Output: 3
