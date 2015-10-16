#!/usr/bin/python
# -*- coding: utf-8 -*-

""" This file is used to test chat-functionality for our home page
    
    The reason for having this code in a separate file is because
    we couldn't found a solution for opening two browsers at the
    same time when using unittest for our testings.

    The tests in this file depends on the registrations of users
    done in sel_tester.py
"""

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
import time
from selenium.webdriver.common.keys import Keys

sleepTimer = 0.5

# Create a new instance of the Firefox driver
driver2 = webdriver.Firefox()
driver1 = webdriver.Firefox()

# Go to home page
driver1.get("localhost:3000")
driver2.get("localhost:3000")

def login(username, password, driver):
    driver.find_element_by_id('username').send_keys(username)
    driver.find_element_by_id('password').send_keys(password)
    driver.find_element_by_class_name('button').click()
    time.sleep(0.5)

def startChat(friend, driver):
    driver.find_element_by_class_name("right-off-canvas-toggle").click()
    time.sleep(1)
    friend_element = driver.find_element_by_link_text(friend)
    friend_element.find_element_by_xpath('//i').click()
    time.sleep(0.5)

    temp_string = "//button[contains(text(), '" + friend + "')]" 
    driver.find_element_by_xpath(temp_string).click()
    time.sleep(0.5)

def sendChatMessage(message, driver):
    driver.find_element_by_xpath("//input[@id='chatInput']").send_keys(message)
    time.sleep(0.5)
    driver.execute_script("document.querySelectorAll('button#sendChatButton')[0].click()")
    time.sleep(0.5)
    

def addFriend(friend, driver):
    driver.find_element_by_tag_name('input').send_keys(friend)
    driver.find_element_by_tag_name('input').send_keys(Keys.ENTER)
    driver.find_element_by_link_text('Go').click()
    time.sleep(0.5)
    driver.find_element_by_link_text(friend).send_keys(Keys.ENTER)
    tempString = "//button[contains(text(), 'Add " + friend + "')]"
    driver.find_element_by_xpath(tempString).click()
    #driver.find_element_by_xpath("//button[contains(text(), 'Add Bruce Wayne')]").click()
    time.sleep(0.5)
    driver.find_element_by_link_text("Socialize").click()
    time.sleep(0.5)

time.sleep(0.5)
login('testUserName', 'testPassword', driver1)
startChat('Bruce Wayne', driver1)

login('batman', 'batman', driver2)
startChat('testUserFirstName testUserLastName', driver2)

sendChatMessage('Hi there batman', driver1)

# Check so that batman got the message
bodyText = driver2.find_element_by_tag_name('body').text
check = 'Hi there batman' in bodyText
assert check == True


time.sleep(3)

driver1.quit()
driver2.quit()


"""def register(username, password, d):
d.get("localhost:3000/logout")
d.find_element_by_link_text("Registrera nytt konto").click()
d.find_element_by_name("username").send_keys(username)
d.find_element_by_name("password").send_keys(password)
d.find_element_by_class_name("btn-success").click()


def login(username, password, d):
d.find_element_by_name("username").send_keys(username)
d.find_element_by_name("password").send_keys(password)
d.find_element_by_class_name("btn-success").click()

def addFriend(friend, d):
d.get("localhost:3000")
d.find_element_by_id("searchField").send_keys(friend)
d.find_element_by_id("searchField").send_keys(Keys.RETURN)
time.sleep(sleepTimer)
d.find_element_by_id("search-result").find_element_by_css_selector("a").click()
time.sleep(sleepTimer)
d.find_element_by_id("main").find_element_by_css_selector("button").click()

def acceptFriend(d):
d.get("localhost:3000")
d.find_element_by_link_text("Förfrågningar").click()
time.sleep(sleepTimer)
d.find_element_by_id("friendRequests").find_element_by_css_selector("a").click()

def startChat(friend, d):
time.sleep(sleepTimer)
d.get("localhost:3000")
d.find_element_by_link_text("Chat").click()
time.sleep(sleepTimer)
d.find_element_by_id("user-" + friend).click()
def sendChatMessage(message, d):
time.sleep(sleepTimer)
d.find_element_by_id("m").send_keys(message)
time.sleep(sleepTimer)
d.find_element_by_id("messageSend").find_element_by_css_selector("button").click()
time.sleep(sleepTimer)
assert d.find_element_by_css_selector("ul#messages li:first-child").text == d.find_element_by_id("username").text + ": " + message # Checks if the chat message was sent

def postMessage(message, friend, d):
d.find_element_by_id("searchField").send_keys(friend)
d.find_element_by_id("searchField").send_keys(Keys.RETURN)
time.sleep(sleepTimer)
d.find_element_by_id("search-result").find_element_by_css_selector("a").click()
time.sleep(sleepTimer)
d.find_element_by_id("newMessage").send_keys(message)
d.find_element_by_id("sendMessage").click()
time.sleep(sleepTimer)
assert d.find_element_by_css_selector("#wallMsg div.message:last-child p.ng-binding").text == message # Checks if the message was posted

register("admin","admin", driver1)
register("admin","newpassword", driver1) # Username exists - no new account will be created
assert driver1.current_url == "http://localhost:3000/register?error"
register("joeka", "qwe", driver1)
register("emios", "qwe", driver1)

login("admin","qwe", driver1) # Try logging in with the wrong password
assert driver1.current_url == "http://localhost:3000/?credentials"
login("admin","admin", driver1)
assert driver1.find_element_by_id("username").text == "admin" # Checks if current user is admin
login("joeka", "qwe", driver2)
login("emios", "qwe", driver3)

addFriend("joeka", driver1)
addFriend("admin", driver2) # Accept friend via addFriend function

addFriend("emios", driver2)

acceptFriend(driver3) # Accept friend via acceptFriend function

startChat("joeka", driver3) # Initiate a new chat
assert driver3.find_element_by_id("chat").get_attribute("class") != "hide" # Checks if the chat is open

sendChatMessage("Hejsan joeka! (1)", driver3) # Send chat message
sendChatMessage("Hejsan emios! (2)", driver2) # Reply chat message

postMessage("Hejsan joeka!", "joeka", driver1) # Post a message on someone else's page
postMessage("Hejsan admin!", "joeka", driver2) # Reply to a message on my own page
postMessage("Varför skriver du på din egen vägg?!", "joeka", driver1)

driver1.quit()
driver2.quit()
driver3.quit()
"""
