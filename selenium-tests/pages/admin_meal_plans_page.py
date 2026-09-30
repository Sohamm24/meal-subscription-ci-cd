from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pages.base_page import BasePage
from typing import List, Dict


class AdminMealPlansPage(BasePage):
    PAGE_TITLE = (By.CLASS_NAME, "page-title")
    CREATE_PLAN_BTN = (By.ID, "create-plan-btn")
    NAME_INPUT = (By.ID, "mp-name")
    DESC_INPUT = (By.ID, "mp-desc")
    PRICE_INPUT = (By.ID, "mp-price")
    TYPE_SELECT = (By.ID, "mp-type")
    STATUS_SELECT = (By.ID, "mp-status")
    SAVE_PLAN_BTN = (By.ID, "save-plan-btn")
    MODAL_TITLE = (By.ID, "modal-title")
    SUCCESS_ALERT = (By.CLASS_NAME, "alert-success")
    ERROR_ALERT = (By.CLASS_NAME, "alert-error")
    TABLE_ROWS = (By.CSS_SELECTOR, "table.table tbody tr")

    def open(self) -> None:
        super().open("/admin/meal-plans")

    def click_create_new(self) -> None:
        self.safe_click(*self.CREATE_PLAN_BTN)

    def fill_and_save_form(self, name: str, desc: str, price: str, meal_type: str = "dinner", status: str = "active") -> None:
        name_el = self.wait_for_visible(*self.NAME_INPUT)
        name_el.clear()
        name_el.send_keys(name)

        desc_el = self.wait_for_visible(*self.DESC_INPUT)
        desc_el.clear()
        desc_el.send_keys(desc)

        price_el = self.wait_for_visible(*self.PRICE_INPUT)
        price_el.clear()
        price_el.send_keys(price)

        type_el = self.wait_for_visible(*self.TYPE_SELECT)
        Select(type_el).select_by_value(meal_type)

        status_el = self.wait_for_visible(*self.STATUS_SELECT)
        Select(status_el).select_by_value(status)

        self.safe_click(*self.SAVE_PLAN_BTN)

    def create_meal_plan(self, name: str, desc: str, price: str, meal_type: str = "dinner", status: str = "active") -> None:
        self.click_create_new()
        self.fill_and_save_form(name, desc, price, meal_type, status)

    def edit_meal_plan(self, plan_id: int, name: str, desc: str, price: str, meal_type: str = "dinner", status: str = "active") -> None:
        self.safe_click(By.ID, f"edit-plan-{plan_id}")
        self.fill_and_save_form(name, desc, price, meal_type, status)

    def delete_meal_plan(self, plan_id: int) -> None:
        self.safe_click(By.ID, f"delete-plan-{plan_id}")
        try:
            WebDriverWait(self.driver, 5).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert.accept()
        except Exception:
            try:
                alert = self.driver.switch_to.alert
                alert.accept()
            except Exception:
                pass

    def get_plans_list(self) -> List[Dict[str, str]]:
        rows = self.wait_for_elements(*self.TABLE_ROWS)
        results = []
        for row in rows:
            cols = row.find_elements(By.TAG_NAME, "td")
            if len(cols) >= 4:
                results.append({
                    "name": cols[0].text,
                    "description": cols[1].text,
                    "price": cols[2].text,
                    "status": cols[3].text,
                })
        return results

    def get_success_message(self) -> str:
        el = self.wait_for_visible(*self.SUCCESS_ALERT)
        return (el.text or el.get_attribute("textContent") or "").strip()
