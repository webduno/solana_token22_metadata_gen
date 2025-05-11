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
        name: `Test Token ${symbol}`,
        symbol: symbol,
        description: `Test Coin Description for ${symbol}`,
        image: "https://github.com/webduno/solana_token22_metadata_gen/blob/main/image-256x256.png"
    };
}

// Function to find the highest symbol in the gen directory
function findLastSymbol(genDir) {
    if (!fs.existsSync(genDir)) return null;
    const files = fs.readdirSync(genDir);
    const symbols = files
        .map(f => {
            const match = f.match(/^metadata_([A-Z]{3})\.json$/);
            return match ? match[1] : null;
        })
        .filter(Boolean)
        .sort();
    return symbols.length > 0 ? symbols[symbols.length - 1] : null;
}

// Function to generate multiple metadata files
function generateMetadataFiles(count = 100) {
    const genDir = path.join(__dirname, 'gen');
    
    // Ensure gen directory exists
    if (!fs.existsSync(genDir)) {
        fs.mkdirSync(genDir);
    }
    
    const lastSymbol = findLastSymbol(genDir);
    let currentSymbol = lastSymbol ? getNextSymbol(lastSymbol) : 'AAA';
    
    for (let i = 0; i < count; i++) {
        const metadata = generateMetadata(currentSymbol);
        const fileName = `metadata_${currentSymbol}.json`;
        const filePath = path.join(genDir, fileName);
        
        fs.writeFileSync(
            filePath,
            JSON.stringify(metadata, null, 4)
        );
        
        console.log(`Generated ${fileName}`);
        currentSymbol = getNextSymbol(currentSymbol);
    }
}

// Generate 100 metadata files, continuing from the last symbol if present
generateMetadataFiles(); 