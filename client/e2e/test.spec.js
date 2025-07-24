// const {test,expect} = require('@playwright/test');

// test("try loggin into the test login page", async ({page}) =>{

//     await page.goto("https://the-internet.herokuapp.com/login");
    

//   // 2. Fill in the username
//   await page.getByRole('Textbox', {name: 'Username'}).fill('tomsmith');

//   // 3. Fill in the password
//   await page.getByLabel('Password').fill("SuperSecretPassword!");

//   // 4. Click the Login button
//   await page.getByRole('button',{name: 'Login'}).click();

//   // 5. Check that the error message is visible
//   await !expect(page.getByText("Password is invalid")).toBeVisible();
  
// })