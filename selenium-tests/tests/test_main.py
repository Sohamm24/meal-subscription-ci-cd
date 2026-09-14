from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def test_home_page():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)

    try:
        driver.get("http://host.docker.internal:5173")

        assert "MealSub" in driver.title

    finally:
        driver.quit()