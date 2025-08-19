# test_selenium.py

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
from datetime import datetime

BASE_URL = "http://127.0.0.1:3000/html/"

# Carpeta para screenshots
SCREENSHOT_DIR = "screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

@pytest.fixture
def driver():
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.maximize_window()
    yield driver
    driver.quit()

# Función para capturas
def take_screenshot(driver, test_name):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{SCREENSHOT_DIR}/{test_name}_{timestamp}.png"
    driver.save_screenshot(filename)

# =========================
# LOGIN
# =========================
def test_login_correcto(driver):
    test_name = "test_login_correcto"
    driver.get(BASE_URL + "index.html")
    driver.find_element(By.ID, "username").send_keys("SoMordan")
    driver.find_element(By.ID, "password").send_keys("1234")
    driver.find_element(By.ID, "btn-iniciarSesion").click()
    time.sleep(1)
    take_screenshot(driver, test_name)
    assert "inicio.html" in driver.current_url

def test_login_incorrecto(driver):
    test_name = "test_login_incorrecto"
    driver.get(BASE_URL + "index.html")
    driver.find_element(By.ID, "username").send_keys("wrong")
    driver.find_element(By.ID, "password").send_keys("wrong")
    driver.find_element(By.ID, "btn-iniciarSesion").click()
    time.sleep(1)
    take_screenshot(driver, test_name)
    error_text = driver.find_element(By.ID, "error-message").text
    assert "incorrecto" in error_text.lower()

# =========================
# EMPLEADOS
# =========================
def test_agregar_empleado(driver):
    test_name = "test_agregar_empleado"
    driver.get(BASE_URL + "empleados.html")
    driver.find_element(By.ID, "btn-agregar").click()
    driver.find_element(By.ID, "nombre").send_keys("Pedro")
    driver.find_element(By.ID, "apellido").send_keys("Acosta")
    driver.find_element(By.ID, "puesto").send_keys("Masajista")
    driver.find_element(By.ID, "telefono").send_keys("8091234567")
    driver.find_element(By.ID, "horario").send_keys("9am-5pm")
    driver.find_element(By.ID, "jornada").send_keys("Completa")
    driver.find_element(By.ID, "status").send_keys("Activo")
    driver.find_element(By.ID, "usuario").send_keys("PedroA")
    driver.find_element(By.ID, "pass").send_keys("1233")
    driver.find_element(By.CSS_SELECTOR, "#formEmpleado button[type='submit']").click()
    
    alert = driver.switch_to.alert
    assert "Empleado agregado con éxito" in alert.text
    alert.accept()
    take_screenshot(driver, test_name)
    time.sleep(1)

def test_editar_empleado(driver):
    test_name = "test_editar_empleado"
    driver.get(BASE_URL + "empleados.html")
    first_edit_btn = driver.find_element(By.CSS_SELECTOR, "#empleados-body button")
    first_edit_btn.click()
    driver.find_element(By.ID, "nombre").clear()
    driver.find_element(By.ID, "nombre").send_keys("JuanEdit")
    driver.find_element(By.ID, "usuario").send_keys("juanp")
    driver.find_element(By.ID, "pass").send_keys("123")
    driver.find_element(By.CSS_SELECTOR, "#formEmpleado button[type='submit']").click()
    
    alert = driver.switch_to.alert
    assert "Empleado actualizado" in alert.text
    alert.accept()
    take_screenshot(driver, test_name)
    time.sleep(1)

def test_eliminar_empleado(driver):
    test_name = "test_eliminar_empleado"
    driver.get(BASE_URL + "empleados.html")
    driver.find_element(By.CSS_SELECTOR, "#empleados-body tr:first-child button.delete-btn").click()
    
    alert = driver.switch_to.alert
    assert "Empleado eliminado" in alert.text
    alert.accept()
    take_screenshot(driver, test_name)
    time.sleep(1)

# =========================
# CITAS
# =========================
def test_agregar_cita(driver):
    test_name = "test_agregar_cita"
    driver.get(BASE_URL + "citas.html")
    driver.find_element(By.ID, "btn-agregar").click()
    driver.find_element(By.ID, "cliente").send_keys("Maria")
    driver.find_element(By.ID, "contacto").send_keys("8097654321")
    driver.find_element(By.ID, "masajista").send_keys("Ana")
    driver.find_element(By.ID, "paquete").send_keys("Relax")
    driver.find_element(By.ID, "hora").send_keys("10:00")
    driver.find_element(By.ID, "fecha").send_keys("2025-08-20")
    driver.find_element(By.ID, "status").send_keys("Pendiente")
    driver.find_element(By.CSS_SELECTOR, "#formCita button[type='submit']").click()
    
    alert = driver.switch_to.alert
    assert "Cita agregada" in alert.text
    alert.accept()
    take_screenshot(driver, test_name)
    time.sleep(1)

def test_editar_cita(driver):
    test_name = "test_editar_cita"
    driver.get(BASE_URL + "citas.html")
    driver.find_element(By.CSS_SELECTOR, "#citas-body tr:first-child button.edit-btn").click()
    driver.find_element(By.ID, "cliente").clear()
    driver.find_element(By.ID, "cliente").send_keys("Maria Lopez")
    driver.find_element(By.CSS_SELECTOR, "#formCita button[type='submit']").click()
    
    alert = driver.switch_to.alert
    assert "Cita actualizada" in alert.text
    alert.accept()
    take_screenshot(driver, test_name)
    time.sleep(1)

def test_eliminar_cita(driver):
    test_name = "test_eliminar_cita"
    driver.get(BASE_URL + "citas.html")
    driver.find_element(By.CSS_SELECTOR, "#citas-body tr:first-child button.delete-btn").click()
    
    alert = driver.switch_to.alert
    assert "Cita eliminada" in alert.text
    alert.accept()
    take_screenshot(driver, test_name)
    time.sleep(1)

# =========================
# PAQUETES
# =========================
def test_agregar_paquete(driver):
    test_name = "test_agregar_paquete"
    driver.get(BASE_URL + "paquetes.html")
    driver.find_element(By.ID, "btn-agregar").click()
    driver.find_element(By.ID, "nombre").send_keys("Masaje Relajante")
    driver.find_element(By.ID, "descripcion").send_keys("Relaja el cuerpo")
    driver.find_element(By.ID, "duracion").send_keys("1hr")
    driver.find_element(By.CSS_SELECTOR, "#formPaquete button[type='submit']").click()
    
    alert = driver.switch_to.alert
    assert "Paquete agregado" in alert.text
    alert.accept()
    take_screenshot(driver, test_name)
    time.sleep(1)

def test_editar_paquete(driver):
    test_name = "test_editar_paquete"
    driver.get(BASE_URL + "paquetes.html")
    driver.find_element(By.CSS_SELECTOR, "#paquetes-body tr:first-child button.edit-btn").click()
    driver.find_element(By.ID, "nombre").clear()
    driver.find_element(By.ID, "nombre").send_keys("Masaje Total")
    driver.find_element(By.CSS_SELECTOR, "#formPaquete button[type='submit']").click()
    
    alert = driver.switch_to.alert
    assert "Paquete actualizado" in alert.text
    alert.accept()
    take_screenshot(driver, test_name)
    time.sleep(1)

def test_eliminar_paquete(driver):
    test_name = "test_eliminar_paquete"
    driver.get(BASE_URL + "paquetes.html")
    driver.find_element(By.CSS_SELECTOR, "#paquetes-body tr:first-child button.delete-btn").click()
    
    alert = driver.switch_to.alert
    assert "Paquete eliminado" in alert.text
    alert.accept()
    take_screenshot(driver, test_name)
    time.sleep(1)
