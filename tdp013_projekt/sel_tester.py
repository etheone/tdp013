# python -m SimpleHTTPServer 8000
#!/usr/bin/env python
#-*- coding: utf-8 -*-

import unittest

import time

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.common.keys import Keys

class SocializeTests(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        #self.driver2 = webdriver.Firefox()

    def test_A_register(self):
        driver = self.driver
        #driver2 = self.driver2
        
        driver.get("localhost:3000/#/register")

        #time.sleep(1)
        """ Testing to registrate a user
        When a registration is successful, the user is automatically logged in """
        firstNameInputField = driver.find_element_by_id("firstName")
        firstNameInputField.send_keys("testUserFirstName")
        lastNameInputField = driver.find_element_by_id("Text1")
        lastNameInputField.send_keys("testUserLastName")
        userNameInputField = driver.find_element_by_id("username")
        userNameInputField.send_keys("testUserName")
        passwordInputField = driver.find_element_by_id("password")
        passwordInputField.send_keys("testPassword")
        time.sleep(0.5)
        # Find the register-button
        registerButton = driver.find_element_by_class_name("button")
        registerButton.click()
        time.sleep(0.5)
        # Check so we came to the home page
        self.assertEqual("home" in driver.current_url, True)

        """ Testing register a user with a already used username """
        # Start by logging out testUserName
        logout = driver.find_element_by_link_text("Log out")
        logout.send_keys(Keys.ENTER)
        time.sleep(0.5)
        # Go to registration page
        driver.find_element_by_link_text("Register").send_keys(Keys.ENTER)
        # Fill out the form, with the same user info
        firstNameInputField = driver.find_element_by_id("firstName")
        firstNameInputField.send_keys("testUserFirstName")
        lastNameInputField = driver.find_element_by_id("Text1")
        lastNameInputField.send_keys("testUserLastName")
        userNameInputField = driver.find_element_by_id("username")
        userNameInputField.send_keys("testUserName")
        passwordInputField = driver.find_element_by_id("password")
        passwordInputField.send_keys("testPassword")
        time.sleep(0.5)
        # Find the register-button
        registerButton = driver.find_element_by_class_name("button")
        registerButton.click()
        time.sleep(0.5)
        # Check so we didn't came to the home page
        self.assertNotEqual("home" in driver.current_url, True)
        # Check so error message is displayed
        bodyText = driver.find_element_by_tag_name('body').text
        self.assertEqual("Registration failed." in bodyText, True)
        time.sleep(0.5)

    def test_B_login(self):
        driver = self.driver
        #driver.get("file:///home/emil/kurser/tdp013/lab1/index.html")

        driver.get("localhost:3000/#/login")

        time.sleep(0.5)

        """ Testing to log in with a user which username is not registred """
        userNameInputField = driver.find_element_by_id("username")
        userNameInputField.send_keys("testNotReggedUser")
        passwordInputField = driver.find_element_by_id("password")
        passwordInputField.send_keys("testPassword")
        time.sleep(0.5)
        loginButton = driver.find_element_by_class_name('button')
        loginButton.click()
        time.sleep(0.5)

        # Authentication should fail here
        # Check so we didn't came to the home page
        self.assertNotEqual("home" in driver.current_url, True)
        bodyText = driver.find_element_by_tag_name('body').text
        # Check that error message is displayed
        self.assertEqual("Authentication failed!" in bodyText, True)


        """ Testing to log in with correct username but wrong password """
        userNameInputField.clear()
        userNameInputField.send_keys("testUserName")
        passwordInputField.clear()
        passwordInputField.send_keys("testWrongPassword")
        time.sleep(0.5)
        loginButton.click()
        time.sleep(0.5)

        # Authentication should fail here
        # Check so we didn't came to the home page
        self.assertNotEqual("home" in driver.current_url, True)
        bodyText = driver.find_element_by_tag_name('body').text
        # Check that error message is displayed
        self.assertEqual("Authentication failed!" in bodyText, True)

        """ Testing to log in with correct username and password """
        userNameInputField.clear()
        userNameInputField.send_keys("testUserName")
        passwordInputField.clear()
        passwordInputField.send_keys("testPassword")
        time.sleep(0.5)
        loginButton.click()
        time.sleep(0.5)

        # Authentication should be successful
        # Check so we came to the home page
        self.assertEqual("home" in driver.current_url, True)
        bodyText = driver.find_element_by_tag_name('body').text
        # Check that no error message is displayed
        self.assertNotEqual("Authentication failed!" in bodyText, True)

       

    def test_C_adding_friends(self):
        driver = self.driver
        driver.get("localhost:3000/#/register")

        """ First we register two dummy testUsers so our primary testUser can add theese as friends """
        firstNameInputField = driver.find_element_by_id("firstName")
        firstNameInputField.send_keys("Bruce")
        lastNameInputField = driver.find_element_by_id("Text1")
        lastNameInputField.send_keys("Wayne")
        userNameInputField = driver.find_element_by_id("username")
        userNameInputField.send_keys("batman")
        passwordInputField = driver.find_element_by_id("password")
        passwordInputField.send_keys("batman")
        time.sleep(0.5)
        # Find the register-button
        registerButton = driver.find_element_by_class_name("button")
        registerButton.click()
        time.sleep(0.5)

        # Add our test user as a friend for later testing
        driver.find_element_by_tag_name('input').send_keys('testUserFirstName testUserLastName')
        driver.find_element_by_tag_name('input').send_keys(Keys.ENTER)
        time.sleep(0.5)
        searchButton = driver.find_element_by_link_text('Go')
        searchButton.click()
        time.sleep(0.5)

        # Go to testUser page
        driver.find_element_by_link_text('testUserFirstName testUserLastName').send_keys(Keys.ENTER)
        time.sleep(0.5)
        # Add testUser as friend
        addFriendButton = driver.find_element_by_xpath("//button[contains(text(), 'Add testUserFirstName testUserLastName')]")
        addFriendButton.click()
        time.sleep(0.5)


        # Log out batman
        logout = driver.find_element_by_link_text("Log out")
        logout.send_keys(Keys.ENTER)
        time.sleep(0.5)

        driver.find_element_by_link_text("Register").send_keys(Keys.ENTER)
        firstNameInputField = driver.find_element_by_id("firstName")
        firstNameInputField.send_keys("Clark")
        lastNameInputField = driver.find_element_by_id("Text1")
        lastNameInputField.send_keys("Kent")
        userNameInputField = driver.find_element_by_id("username")
        userNameInputField.send_keys("superman")
        passwordInputField = driver.find_element_by_id("password")
        passwordInputField.send_keys("superman")
        time.sleep(0.5)
        # Find the register-button
        driver.find_element_by_class_name("button").click()
        #registerButton = driver.find_element_by_class_name("button")
        #registerButton.click()
        time.sleep(0.5)
        # Log out superman
        logout = driver.find_element_by_link_text("Log out")
        logout.send_keys(Keys.ENTER)
        time.sleep(0.5)

        # Log in with our testUser
        userNameInputField = driver.find_element_by_id("username")
        userNameInputField.send_keys("testUserName")
        passwordInputField = driver.find_element_by_id("password")
        passwordInputField.send_keys("testPassword")
        time.sleep(0.5)
        driver.find_element_by_class_name('button').click()
        #loginButton.click()
        time.sleep(0.5)

        """ Adding Bruce Wayne as our friend """
        # Search for Bruce Wayne
        driver.find_element_by_tag_name('input').send_keys('Bruce Wayne')
        driver.find_element_by_tag_name('input').send_keys(Keys.ENTER)
        time.sleep(0.5)
        searchButton = driver.find_element_by_link_text('Go')
        searchButton.click()
        time.sleep(0.5)

        # Go to Bruce Waynes page
        driver.find_element_by_link_text('Bruce Wayne').send_keys(Keys.ENTER)
        # Check so we cant post a message because we are not friends
        writePostButtons = driver.find_elements_by_xpath("//button[contains(text(), 'Write Post')]")
        time.sleep(0.5)
        self.assertEqual(len(writePostButtons), 0)

        # Add Bruce Wayne as friend
        addFriendButton = driver.find_element_by_xpath("//button[contains(text(), 'Add Bruce Wayne')]")
        addFriendButton.click()
        time.sleep(0.5)

        """ Adding Clark Kent as our friend """
        driver.find_element_by_link_text("Socialize").click()
        driver.find_element_by_tag_name('input').send_keys('Clark Kent')
        driver.find_element_by_tag_name('input').send_keys(Keys.ENTER)
        time.sleep(0.5)
        searchButton = driver.find_element_by_link_text('Go')
        searchButton.click()
        time.sleep(0.5)

        # Go to Clark Kent page
        driver.find_element_by_link_text('Clark Kent').send_keys(Keys.ENTER)
        # Check so we cant post a message because we are not friends
        writePostButtons = driver.find_elements_by_xpath("//button[contains(text(), 'Write Post')]")
        time.sleep(0.5)
        self.assertEqual(len(writePostButtons), 0)

        # Add Clark Kent as friend
        addFriendButton = driver.find_element_by_xpath("//button[contains(text(), 'Add Clark Kent')]")
        addFriendButton.click()
        time.sleep(0.5)

        # Go to our home page and check if we have Clark and Bruce as friends in our friend list
        driver.find_element_by_link_text("Socialize").click()
        time.sleep(0.5)
        driver.find_element_by_class_name("right-off-canvas-toggle").click()

        friend = []
        friends = driver.find_elements_by_xpath("//li[@ng-repeat='f in friends']")
        #print("Test here:")
        #for friend in friends:
        #    print (friend.text)
        self.assertEqual(friends[0].text, 'Bruce Wayne')
        self.assertEqual(friends[1].text, 'Clark Kent')

        time.sleep(0.5)


    def test_D_posts(self):
        driver = self.driver
        driver.get("localhost:3000/#/login")

        # Log in with our testUser
        userNameInputField = driver.find_element_by_id("username")
        userNameInputField.send_keys("testUserName")
        passwordInputField = driver.find_element_by_id("password")
        passwordInputField.send_keys("testPassword")
        time.sleep(0.5)
        driver.find_element_by_class_name('button').click()
        #loginButton.click()
        time.sleep(0.5)

        # Go to Bruce Waynes page
        driver.find_element_by_class_name("right-off-canvas-toggle").click()
        time.sleep(0.5)
        driver.find_element_by_link_text('Bruce Wayne').send_keys(Keys.ENTER)
        time.sleep(0.5)
    
        writePostButton = driver.find_element_by_xpath("//button[contains(text(), 'Write post')]")
        writePostButton.click()
        time.sleep(0.5)
        driver.find_element_by_tag_name('textarea').send_keys("Hi Bruce! Nice crime-fighting skills you showed last night!!")
        time.sleep(0.5)
        driver.find_element_by_xpath("//button[contains(text(), 'Send')]").click()
        time.sleep(0.5)
        bodyText = driver.find_element_by_tag_name('body').text
        # Check that the post appeared on the page
        self.assertEqual("Hi Bruce! Nice crime-fighting skills you showed last night!!" in bodyText, True)


    def test_E_upload_images(self):
        driver = self.driver
        driver.get("localhost:3000/#/login")

        # Log in with our testUser
        userNameInputField = driver.find_element_by_id("username")
        userNameInputField.send_keys("testUserName")
        passwordInputField = driver.find_element_by_id("password")
        passwordInputField.send_keys("testPassword")
        time.sleep(0.5)
        driver.find_element_by_class_name('button').click()
        #loginButton.click()
        time.sleep(0.5)

        driver.find_element_by_link_text('Images').click()
        time.sleep(0.5)
        driver.find_element_by_xpath("//button[contains(text(), 'Upload picture')]").click()
        time.sleep(0.5)
        #driver.find_element_by_name("file").send_keys("./testimage1.png")
        driver.find_element_by_css_selector("input[type=\"file\"]").send_keys("/home/tommy/kurser/tdp013/tdp013_projekt/testimage1.png")
        time.sleep(0.5)
        driver.find_element_by_id("sendImage").click()
        #driver.find_element_by_xpath("//button[contains(text(), 'Send')]").click()
        # Wait 4 seconds to make sure that we see the image
        time.sleep(4)
        # Check if the picture shows in the browser
        images = []
        images = driver.find_elements_by_id("imageDiv")
        self.assertEqual(len(images), 1)
        time.sleep(0.5)

        # Upload another picture
        driver.find_element_by_css_selector("input[type=\"file\"]").send_keys("/home/tommy/kurser/tdp013/tdp013_projekt/testimage2.png")
        time.sleep(0.5)
        #driver.execute_script("document.querySelectorAll('button#sendImageButton')[0].click()")
        #driver.find_element_by_xpath("//button[contains(text(), 'Send')]").click()
        driver.find_element_by_id("sendImage").click()
        # Wait 4 seconds to make sure that we see the image
        time.sleep(4)
        # Check if the picture shows in the browser
        #images = []
        images = driver.find_elements_by_id("imageDiv")
        self.assertEqual(len(images), 2)
        time.sleep(0.5)
        
    """def test_E_chats(self):
        driver = self.driver
        driver.get("localhost:3000/#/login")

        time.sleep(2)"""

        
        

    """
    def test_checkboxes(self):
        driver = self.driver
    #        driver.get("localhost:8000")
        driver.get("file:///home/emil/kurser/tdp013/lab1/index.html")
        textAreaElement = driver.find_element_by_id("newMessage")
        textAreaElement.send_keys("First")
        textAreaElement.submit()
        time.sleep(1)

        textAreaElement.send_keys("Second")
        textAreaElement.submit()
        time.sleep(1)

        messages = driver.find_elements_by_class_name("unread")
        for checkbox in messages:
            checkbox.find_element_by_xpath("input").click()
            time.sleep(2)

        for element in messages:
            self.assertEqual(element.get_attribute("class"), "read")
    """

    def tearDown(self):
        self.driver.close()
        #self.driver2.close()

if __name__ == "__main__":
    unittest.main()

""" Different types of comment....

        #driver.find_element_by
        #logout = driver.find_element_by_xpath("//a[@ng-click='logout()']")
        #driver.find_element_by_link_text("Log out").click()



        # Find the error div
        errorDivElement = driver.find_element_by_id("errorText")
        # Test that errormessage is not displayed when page is loaded
        self.assertEqual(errorDivElement.value_of_css_property("display"), "none")
        # Find the textarea
        textAreaElement = driver.find_element_by_id("newMessage")

        textAreaElement.send_keys("")
        textAreaElement.submit()
        time.sleep(1)

        # Test that errormessage is displayed with empty textbox
        self.assertEqual(errorDivElement.value_of_css_property("display"), "inline-block")

        textAreaElement.send_keys("Cheese!")
        textAreaElement.submit()
        time.sleep(1)

        # Test that errormessage is removed if we enter a valid message
        self.assertEqual( errorDivElement.value_of_css_property("display"), "none" )

        s = "a" * 150
        textAreaElement.send_keys(s)
        textAreaElement.submit()
        time.sleep(1)

        # Test that errormessage is displayed when to long string is submitted
        self.assertEqual(errorDivElement.value_of_css_property("display"), "inline-block")


        # Find the textarea
        textAreaElement = driver.find_element_by_id("newMessage")
        textAreaElement.send_keys("First")
        textAreaElement.submit()
        time.sleep(1)

        # Test if First is div with classname "unread"
        addedMessage = driver.find_element_by_class_name("unread").text
        self.assertIn("First", addedMessage)

        textAreaElement.send_keys("Second")
        textAreaElement.submit()
        time.sleep(1)

        # Test if Second message is above the first
        newestMessage = driver.find_element_by_xpath("//div[@class='unread']")
        self.assertEqual(newestMessage.text, "Second")

        textAreaElement.send_keys("Third")
        textAreaElement.submit()
        time.sleep(1)
        
        # Collect all added messages divs in a list
        addedMessages = driver.find_elements_by_class_name("unread")
        # Check so that newest messages are placed at the top
        self.assertEqual(addedMessages[0].text, "Third")
        self.assertEqual(addedMessages[1].text, "Second")
        self.assertEqual(addedMessages[2].text, "First")
        #for message in addedMessages:
        #    print message.text

        
"""


