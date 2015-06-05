module.exports = {
    "Demo Pongale Play": function (browser) {
        browser
            .url("http://localhost:30010")
            .waitForElementVisible('body', 2000)
            .pause(3000)
            .assert.containsText('h1.titulo', 'Póngale Play')
            .click('div.lista-bandas div.selectable:nth-child(1)')
            .pause(1000)
            .waitForElementVisible('div.lista-discos div.selectable:nth-child(2) div.small-11.columns', 2000)
            .click('div.lista-discos div.selectable:nth-child(2) div.small-11.columns')
            .waitForElementVisible('div.lista-temas div.selectable:nth-child(2) div.columns', 2000)
            .click('div.lista-temas div.selectable:nth-child(2) div.columns')
            .pause(1000)
            .waitForElementVisible('div.lista-temas div.selectable:nth-child(2) div.columns.clickeable', 2000)
            .click('div.lista-temas div.selectable:nth-child(2) div.columns.clickeable')
            .pause(1000)
            .waitForElementVisible('div#menu-temas>div>div:nth-child(1)', 2000)
            .click('div#menu-temas>div>div:nth-child(1)')
            .click('div.volume-range ul li:nth-child(90)')
            .pause(10000)
            .end();
    }
};
