import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe("SMOOTHIE BOWL", "Nutritious AND aesthetic", "https://minimalistbaker.com/wp-content/uploads/2016/07/The-PERFECT-5-minute-Smoothie-Bowl-Simple-ingredients-naturally-sweet-SO-healthy-vegan-glutenfree-smoothiebowl-recipe.jpg"), 
    new Recipe("CHICKEN & SWEET POTATO", "Combo of sweet and spicy", "https://pinchofyum.com/wp-content/uploads/Chicken-Sweet-Potato-Meal-Prep-Bowls-7.jpg"), 
    new Recipe("AVOCADO TOAST", "Excellent source of fiber", "https://www.twopeasandtheirpod.com/wp-content/uploads/2017/06/Everything-Bagel-Avocado-Toast-2.jpg")

  ];

  constructor() { }
  ngOnInit(): void { }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}