from selenium import webdriver

browser = webdriver.Firefox()
browser.get('http://localhost:8000/map')

print(browser.title)
assert 'Dublin Bus' in browser.title