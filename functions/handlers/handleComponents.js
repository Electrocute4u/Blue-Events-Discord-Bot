const { readdirSync,readFileSync } = require("fs")

module.exports = (bot) => {
    // Deleting and reacquiring functions file
    // 

    // Handle components and execute code from file (if the custom ID of an compontent equals a file name)
    bot.handleComponents = async () => {
        const config = JSON.parse(readFileSync(`./config.json`, 'utf8'))
        
        // Require a synched version of directory and return all .js files
        const componentFolders = readdirSync(`./components`);
        for (const folder of componentFolders) {
            const componentFiles = readdirSync(`./components/${folder}`).filter(
                (file) => file.endsWith(".js")
            );
            
            // Assign the buttons from bot.js file 
            const { buttons } = bot
            
            // Switch for different components
            switch (folder) {
                case "buttons":
                    for (const file of componentFiles) {
                    const button = require(`../../components/${folder}/${file}`)
                    buttons.set(button.data.name, button)
                    }
                break;

                default:
                    break;
            }
        }
    }
}