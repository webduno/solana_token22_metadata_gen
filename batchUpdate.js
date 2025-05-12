const fs = require('fs');
const path = require('path');

// Function to recursively find all JSON files in a directory
function findJsonFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            results = results.concat(findJsonFiles(filePath));
        } else if (file.endsWith('.json')) {
            results.push(filePath);
        }
    }
    
    return results;
}

// Function to update metadata files
function updateMetadataFiles(options = {}) {
    const {
        imageUrl = null,
        name = null,
        symbol = null,
        description = null
    } = options;

    // Find all JSON files in the gen directory
    const jsonFiles = findJsonFiles('./gen');
    
    for (const filePath of jsonFiles) {
        try {
            // Read and parse the JSON file
            const content = fs.readFileSync(filePath, 'utf8');
            const metadata = JSON.parse(content);
            
            // Update fields if provided
            if (imageUrl) metadata.image = imageUrl;
            if (name) metadata.name = name;
            if (symbol) metadata.symbol = symbol;
            if (description) metadata.description = description;
            
            // Write the updated content back to the file
            fs.writeFileSync(filePath, JSON.stringify(metadata, null, 4));
            console.log(`Updated: ${filePath}`);
        } catch (error) {
            console.error(`Error processing ${filePath}:`, error.message);
        }
    }
}

// Example usage:
// To update all image URLs:
// updateMetadataFiles({ imageUrl: 'https://new-image-url.com/image.png' });
// example command usage
// node batchUpdate.js --imageUrl https://github.com/webduno/solana_token22_metadata_gen/blob/main/image-256x256.png

// To update multiple fields:
// updateMetadataFiles({
//     imageUrl: 'https://new-image-url.com/image.png',
//     description: 'New description'
// });

module.exports = {
    updateMetadataFiles,
    findJsonFiles
}; 