export default function readFile(file: File) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort();
            reject();
        };

        reader.onload = () => {
            if (!reader.result) return;
            const base64 = reader.result.toString().split(',').pop();
            resolve(base64);
        };

        reader.readAsDataURL(file);
    });
}
