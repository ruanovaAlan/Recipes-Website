const ingredientContainer = document.getElementById('ingredient-container');
const addIngredientButton = document.getElementById('add-ingredient');
const ingredientListInput = document.getElementById('ingredient-list');

const procedureContainer = document.getElementById('procedure-container');
const addProcedureButton = document.getElementById('add-procedure');
const procedureCounterInput = document.getElementById('procedure-counter');

let procedureStep = 1; // Contador para el número de pasos

addIngredientButton.addEventListener('click', () => {
    const ingredientInput = document.createElement('input');
    ingredientInput.className = 'form-control ingredient-input mt-2';
    ingredientInput.placeholder = 'Ingrediente...';
    ingredientContainer.appendChild(ingredientInput);
});

addProcedureButton.addEventListener('click', () => {
    procedureStep++; // Incrementar el contador
    const procedureInput = document.createElement('input');
    procedureInput.className = 'form-control procedure-input mt-2';
    procedureInput.name = `proceso-${procedureStep}`; // Nombre único para cada paso
    procedureInput.placeholder = `Paso ${procedureStep}...`;
    procedureContainer.appendChild(procedureInput);
    procedureCounterInput.value = procedureStep; // Actualizar el valor del contador en el campo oculto
});

document.querySelector('form').addEventListener('submit', () => {
    const ingredients = Array.from(document.querySelectorAll('.ingredient-input')).map(input => "- " + input.value);
    ingredientListInput.value = ingredients.join('\r\n');
    
    const procedureSteps = Array.from(document.querySelectorAll('.procedure-input')).map(input => input.value);
    procedureListInput.value = procedureSteps;
});