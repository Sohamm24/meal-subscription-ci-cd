# Smoke test for frontend landing page title
def test_home_page_title(driver, base_url):
    driver.get(base_url)
    assert "Tandurust" in driver.title or "Meal" in driver.title