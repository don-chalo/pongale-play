module.exports = {
    "Demo Pongale Play": function (browser) {
        browser
            .url("http://localhost:3000/app")
            .waitForElementVisible('body', 1000)
            .pause(1000)
            .assert.containsText('h1', 'Pongale Play')
            .click('div.lista-bandas div.selectable:nth-child(1)')
            .pause(1000)
            .waitForElementVisible('div.lista-discos div.selectable:nth-child(2) div.small-10.columns', 1000)
            .click('div.lista-discos div.selectable:nth-child(2) div.small-10.columns')
            .waitForElementVisible('div.lista-temas div.selectable:nth-child(2) i.fi-plus', 1000)
            .click('div.lista-temas div.selectable:nth-child(2) i.fi-plus')
            .pause(1000)
            .waitForElementVisible('div.lista-reproduccion div.selectable', 1000)
            .end();
    }
};
