# python -m SimpleHTTPServer 8000
#!/usr/bin/env python
#-*- coding: utf-8 -*-

import unittest

import time

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
#import time

class Laboration1Tests(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()

    def test_error_messages(self):
        driver = self.driver
        #driver.get("file:///home/tomli962/kurser/tdp013/lab1/index.html")
        driver.get("localhost:8000")
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

    def test_messages(self):
        driver = self.driver
        #driver.get("file:///home/tomli962/kurser/tdp013/lab1/index.html")
        driver.get("localhost:8000")
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

    def test_checkboxes(self):
        driver = self.driver
        driver.get("localhost:8000")

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

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()

