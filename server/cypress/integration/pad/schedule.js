//Context: Schedule
describe("Schedule",  () => {
    const endpoint = "/schedule";

    //Run before each test in this context
    beforeEach(() => {
        //Set user as logged in
        const session = {
            email: "test@gmail.com",
            username: "test",
            role: 1
        };
        localStorage.setItem("session", JSON.stringify(session));

        //Go to the specified URL
        cy.visit("http://localhost:8080/#schedule");
    });

    //Test: Validate schedule
    it("Valid schedule", () => {
        //Start a fake server
        cy.server();

        //Find the schedule container, check if it exists.
        cy.get(".schedule-container").should("exist");

        //Find dayType icon, check if it exists.
        cy.get(".type-icon").should("exist");
        //Find dayType label, check if it exists.
        cy.get(".day-type").should("exist");
        //Find dayType work-time, check if it exists.
        cy.get(".work-time").should("exist");

        //Find transport icon, check if it exists.
        cy.get(".transport-icon").should("exist");
        //Find transport label, check if it exists.
        cy.get(".transport").should("exist");
        //Find transport travel-distance, check if it exists.
        cy.get(".travel-distance").should("exist");

        //Find CO2 emission, check if it exists.
        cy.get(".emission").should("exist");

        //Find points, check if it exists.
        cy.get(".points").should("exist");
    });

    //Test: Validate schedule dayType: 'Bij klant'.
    it("Valid schedule dayType: 'Bij klant'", () => {
        //Start a fake server
        cy.server();

        const mockedResponse = {
            typeIcon: "fa-user",
            dayType: "bij klant",
            workTime: "08:00 - 17:30",
            transportIcon: "fa-train",
            transport: "trein",
            travelDistance: "13 km",
            emission: "0 g",
            points: "260 punten"
        };

        //Add a stub with the URL /schedule as a POST
        //Respond with a JSON-object when requested and set the status-code tot 401.
        //Give the stub the alias: @schedule
        cy.intercept('POST', endpoint, {
            statusCode: 401,
            body: mockedResponse,
        }).as('schedule');

    });
});
