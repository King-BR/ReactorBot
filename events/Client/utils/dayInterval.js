const Discord = require('discord.js');
const fs = require('fs');
const GithubContent = require('github-content');

module.exports = async (client, botUtils, serverState, guild) => {
  newError = botUtils.newError;
  try {

    //Pegando tradução atual do mindustrt

    let Mindustry = new GithubContent({ owner: 'Anuken', repo: 'Mindustry', })

    Mindustry.file('core/assets/bundles/bundle_pt_BR.properties', function(err, file) {
      if (err) return console.log(err);
      fs.writeFileSync('recent.txt', 'eae')///file.contents.toString());
    });

  } catch (err) {
    console.log(`=> ${newError(err, "ClientReady_ReactionRoles")}`);
  }
}