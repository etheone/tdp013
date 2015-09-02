from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
import time

# Create a new instance of the Firefox driver
driver = webdriver.Firefox()

# go to the google home page
driver.get("file:///home/emil/kurser/tdp013/tdp013/lab1/index.html")

# find the element that's name attribute is q (the google search box)
inputElement = driver.find_element_by_id("newMessage")

print "Testing if error message is hidden: "
inputElement2 = driver.find_element_by_id("errorText")

if inputElement2.value_of_css_property("display") == "none": print "Passed"

print "Testing if error message is displayed: "
inputElement.send_keys("")
inputElement.submit()

if inputElement2.value_of_css_property("display") != "none": print "Passed"

inputElement.send_keys("Cheese")
inputElement.submit()

assertText= driver.find_element_by_class_name("unread").text

assert "Cheese" in assertText



s = "a" * 150
inputElement.send_keys(s)
inputElement.submit()

try:
   
    WebDriverWait(driver, 10).until(lambda driver : driver.title.lower().startswith("laboration"))

   
    print driver.title

    #driver.quit()
finally:
    print "Done!"



"""TODO
Test adding 2 messages
Test that latest message appears above the first
Test to check if color changes when message is read
Check to long message error text
END TODO"""
