const {test, expect} = require("@playwright/test");

test("Calendar validations", async ({page}) => {
    const monthNumber = "5";
    const date = new Date().getDate().toString();
    const year = "2027";
    const expectedList = [monthNumber, date, year];

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month")
              .nth(Number(monthNumber)-1).click();
    await page.locator("//abbr[text()='"+date+"']").click();

    // ✅ Wait for year spinbutton to update to 2027 before reading
    const inputs = page.locator('.react-date-picker__inputGroup__input');
    await inputs.nth(2).waitFor({ state: 'visible' });
    await expect(inputs.nth(2)).toHaveValue(year);  // waits until value is correct

    // Now verify all three inputs
    for (let i = 0; i < expectedList.length; i++) {
        const value = await inputs.nth(i).inputValue();
        expect(value).toEqual(expectedList[i]);
    }
});