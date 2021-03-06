import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
// import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {

    recipesChanged = new Subject<Recipe[]>();
    // recipeSelected = new Subject<Recipe>();

    // Can't be directly accessed from the outside
    // private recipes: Recipe[] = [
        // new Recipe(
            // "SMOOTHIE BOWL", 
            // "Nutritious AND aesthetic", 
            // "https://minimalistbaker.com/wp-content/uploads/2016/07/The-PERFECT-5-minute-Smoothie-Bowl-Simple-ingredients-naturally-sweet-SO-healthy-vegan-glutenfree-smoothiebowl-recipe.jpg", 
            // [
                // new Ingredient('Fresh Berries', 30), 
                // new Ingredient('Milk', 2)
            // ]), 
        // new Recipe(
            // "CHICKEN & SWEET POTATO", 
            // "Combo of sweet and spicy", 
            // "https://pinchofyum.com/wp-content/uploads/Chicken-Sweet-Potato-Meal-Prep-Bowls-7.jpg", 
            // [
                // new Ingredient('Chicken', 5), 
                // new Ingredient('Sweet Potato', 6)
            // ]), 
        // new Recipe(
            // "AVOCADO TOAST", 
            // "Excellent source of fiber", 
            // "https://www.twopeasandtheirpod.com/wp-content/uploads/2017/06/Everything-Bagel-Avocado-Toast-2.jpg", 
            // [
                // new Ingredient('Avocado', 2), 
                // new Ingredient('Bread', 3)
            // ])
    // ];

    private recipes: Recipe[] = [];

    constructor(private shoppingListService: ShoppingListService) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        // Informing interested places that there are new recipes
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes() {
        // Returns a copy of the recipes array
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}