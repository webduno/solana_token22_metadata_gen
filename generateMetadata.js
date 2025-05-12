const fs = require('fs');
const path = require('path');

// Function to generate the next symbol in sequence (AAA, AAB, AAC, etc.)
function getNextSymbol(currentSymbol) {
    if (!currentSymbol) return 'AAA';
    
    const chars = currentSymbol.split('');
    let i = chars.length - 1;
    
    while (i >= 0) {
        if (chars[i] === 'Z') {
            chars[i] = 'A';
            i--;
        } else {
            chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
            break;
        }
    }
    
    return chars.join('');
}

// Function to generate metadata for a given symbol
function generateMetadata(symbol) {
    return {
        name: `${symbol} Coin`,
        symbol: symbol,
        description: `${symbol} is a token program on the Solana blockchain, defining a common implementation for fungible tokens`,
        image: "https://solana22.vercel.app/image.png"
    };
}

// Function to find the highest symbol in the gen directory
function findLastSymbol(genDir) {
    if (!fs.existsSync(genDir)) return null;
    
    let highestSymbol = null;
    
    // Check all subdirectories
    const subDirs = fs.readdirSync(genDir)
        .filter(f => fs.statSync(path.join(genDir, f)).isDirectory());
    
    for (const subDir of subDirs) {
        const files = fs.readdirSync(path.join(genDir, subDir));
        const symbols = files
            .map(f => {
                const match = f.match(/^metadata_([A-Z]{3})\.json$/);
                return match ? match[1] : null;
            })
            .filter(Boolean)
            .sort();
            
        if (symbols.length > 0) {
            const lastSymbol = symbols[symbols.length - 1];
            if (!highestSymbol || lastSymbol > highestSymbol) {
                highestSymbol = lastSymbol;
            }
        }
    }
    
    return highestSymbol;
}

// Function to ensure directory exists
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Function to generate multiple metadata files
function generateMetadataFiles(count = 10000) {
    const genDir = path.join(__dirname, 'gen');
    
    // Ensure gen directory exists
    ensureDir(genDir);
    
    const lastSymbol = findLastSymbol(genDir);
    let currentSymbol = lastSymbol ? getNextSymbol(lastSymbol) : 'AAA';
    
    for (let i = 0; i < count; i++) {
        if (currentSymbol === 'ZZZ') {
            const metadata = generateMetadata(currentSymbol);
            const firstLetter = currentSymbol[0];
            const subDir = path.join(genDir, firstLetter);
            ensureDir(subDir);
            const fileName = `metadata_${currentSymbol}.json`;
            const filePath = path.join(subDir, fileName);
            fs.writeFileSync(
                filePath,
                JSON.stringify(metadata, null, 4)
            );
            console.log(`Generated ${firstLetter}/${fileName}`);
            return; // Stop if ZZZ is reached
        }
        const metadata = generateMetadata(currentSymbol);
        const firstLetter = currentSymbol[0];
        const subDir = path.join(genDir, firstLetter);
        // Ensure subdirectory exists
        ensureDir(subDir);
        const fileName = `metadata_${currentSymbol}.json`;
        const filePath = path.join(subDir, fileName);
        fs.writeFileSync(
            filePath,
            JSON.stringify(metadata, null, 4)
        );
        console.log(`Generated ${firstLetter}/${fileName}`);
        currentSymbol = getNextSymbol(currentSymbol);
    }
}

// Generate 100 metadata files, continuing from the last symbol if present
generateMetadataFiles(); 