import { EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';

export class RecipeService {

    recipeSelected = new EventEmitter<Recipe>();

    // Can't be directly accessed from the outside
    private recipes: Recipe[] = [
        new Recipe("SMOOTHIE BOWL", "Nutritious AND aesthetic", "https://minimalistbaker.com/wp-content/uploads/2016/07/The-PERFECT-5-minute-Smoothie-Bowl-Simple-ingredients-naturally-sweet-SO-healthy-vegan-glutenfree-smoothiebowl-recipe.jpg"), 
        new Recipe("CHICKEN & SWEET POTATO", "Combo of sweet and spicy", "https://pinchofyum.com/wp-content/uploads/Chicken-Sweet-Potato-Meal-Prep-Bowls-7.jpg"), 
        new Recipe("AVOCADO TOAST", "Excellent source of fiber", "https://www.twopeasandtheirpod.com/wp-content/uploads/2017/06/Everything-Bagel-Avocado-Toast-2.jpg")
    ];

    getRecipes() {
        // Returns a copy of the recipes array
        return this.recipes.slice();
    }
}