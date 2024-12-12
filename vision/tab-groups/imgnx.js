let LOG_SWITCH = true,
    log = LOG_SWITCH
        ? console.log
        : function () {
              console.error("`log` is disabled");
          };

let count = 0;
const init = () => {
    $(document).ready(async function routineCheckup() {
        count = count + 1;
        const obj = JSON.stringify({ no: count }),
            blobject = new Blob([JSON.stringify(obj, null, 2)], {
                type: "application/json",
            });

        // log(btoa(b   lobject));

        const prefersDarkScheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (prefersDarkScheme) {
            // Apply dark theme styles
        } else {
            // Apply light theme styles
        }

        let fruits = [
            "🍇",
            "🍈",
            "🍉",
            "🍊",
            "🍋",
            "🍋‍🟩",
            "🍌",
            "🍍",
            "🥭",
            "🍎",
            "🍏",
            "🍐",
            "🍑",
            "🍒",
            "🍓",
            "🫐",
            "🥝",
            "🍅",
            "🫒",
            "🥥",
        ];
        // If the data URL contains non-ASCII characters (eg. 🍎), you need to
        // encode it using `encodeURIComponent` before converting it
        // to a base64-encoded string. For example:
        const emoji = fruits[Math.floor(Math.random() * fruits.length)],
            encodedEmoji = encodeURIComponent(emoji);

        const dataUrl = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${encodedEmoji}</text></svg>`;
        console.log({ emoji, encodedEmoji, dataUrl });
        // console.log(dataUrl);
        document.getElementById("favicon").href = dataUrl;
        // const img = new Image();
        // img.src = dataUrl;
        // const a = btoa(img.src),
        //     b = atob(a);

        const template = document.querySelector("template"),
            documentFragment = template.content,
            clone = documentFragment.cloneNode(true);
        const xhr = new XMLHttpRequest();
        const imageUrl = "https://api.unsplash.com/photos/random";

        xhr.open("GET", imageUrl);
        xhr.setRequestHeader("Authorization", `Client-ID ${authToken}`);
        xhr.send();

        xhr.onload = function () {
            if (xhr.status != 200) {
                log(`Error ${xhr.status}: ${xhr.statusText}`);
            } else {
                return JSON.parse(xhr.responseText);
            }
        };

        const response = await fetch(imageUrl, {
            headers: {
                authorization: `Client-ID ${authToken}`,
            },
        }).then((response) => response.json());

        const img = clone.querySelector("img");
        img.src = response.urls.regular;
        img.alt = response.alt_description;
        document.body.appendChild(clone);

        img.src = href;
        img.alt = "An image";
        img.width = 200;
        img.height = 200;
        document.body.appendChild(img);

        const jsonObject = { name: "Alice", age: 25, city: "Wonderland" };
        const password = "my_secure_password";

        // Encrypt the JSON object
        const encrypted = await encryptJsonToBinary(jsonObject, password);
        log("Encrypted:", encrypted);

        // Decrypt the data back to JSON
        const decryptedJson = await decryptBinaryToJson(encrypted, password);
        log("Decrypted:", decryptedJson);

        LOG_SWITCH = false; // This won't work because the value
        //  of `log` is passed by value, not reference

        log = LOG_SWITCH // This will work. You have to set `log`
            ? // explicitly
              console.log
            : () => {};
        setTimeout(routineCheckup, 10000);
    });
};

async function encryptJsonToBinary(jsonObject, password) {
    // Convert the JSON object to a UTF-8 encoded Uint8Array
    const jsonString = JSON.stringify(jsonObject);
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonString);

    // Derive a cryptographic key from the password
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("some_salt"), // Use a unique salt for security
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );

    // Encrypt the data using AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        data
    );

    // Return the encrypted data and IV as binary (Uint8Array)
    return {
        iv: Array.from(iv),
        encrypted: Array.from(new Uint8Array(encryptedData)),
    };
}

async function decryptBinaryToJson(encryptedObject, password) {
    const { iv, encrypted } = encryptedObject;

    // Convert password to key material
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode("some_salt"), // Same salt used in encryption
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );

    // Convert arrays back to Uint8Array
    const ivArray = new Uint8Array(iv);
    const encryptedArray = new Uint8Array(encrypted);

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: ivArray,
        },
        key,
        encryptedArray
    );

    // Convert decrypted data back to JSON
    const decoder = new TextDecoder();
    const decryptedJsonString = decoder.decode(decryptedData);
    return JSON.parse(decryptedJsonString);
}
