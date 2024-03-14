import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { faArrowLeft, faArrowRight, faCheck, faRotateLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faReset = faRotateLeft;
  faCheck = faCheck;
  faTrash = faTrash;

  postIntro: FormGroup;
  postIngredients: FormGroup;
  postProcess: FormGroup;
  
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    )
    this.postIntro = this._formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      image: [null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }],
      content: ['', [Validators.required]]
    });
    this.postIngredients = this._formBuilder.group({
      amountOfPeople: ['', [Validators.required]],
      ingredients: this._formBuilder.array([
        this._formBuilder.group({
          ingredient: ['', [Validators.required]],
          quantity: ['', [Validators.required]]
        })
      ])
    });

    // this.postProcess = this._formBuilder.group({
    //   difficulty: ['', [Validators.required]],
    //   timeToPrepare: ['', [Validators.required]],
    //   timeToCook: ['', [Validators.required]],
    //   steps: this._formBuilder.array([
    //     this._formBuilder.group({
    //       step: ['', [Validators.required]]
    //     })
    //   ])
    // })
    
    this.postProcess = this._formBuilder.group({
      difficulty: ['', [Validators.required]],
      timeToPrepare: ['', [Validators.required]],
      timeToCook: ['', [Validators.required]],
      steps: this._formBuilder.array([]),
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id, 
            title: postData.title, 
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
            ingredients: postData.ingredients,
            process: postData.process,
            likes: postData.likes
          };
          this.postIntro.patchValue({
            title: this.post.title,
            image: this.post.imagePath,
            content: this.post.content,
          });
          this.postIngredients.patchValue({
            amountOfPeople: this.post.ingredients.amountOfPeople,
            ingredients: this.post.ingredients.ingredients
          });
          this.postProcess.patchValue({
            difficulty: this.post.process.difficulty,
            timeToPrepare: this.post.process.timeToPrepare,
            timeToCook: this.post.process.timeToCook,
            steps: this.post.process.steps
          })
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postIntro.patchValue({ 'image': file });
    this.postIntro.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  checkPostValidity() {
    return this.postIntro.value.title.invalid 
        || this.postIntro.value.image.invalid 
        || this.postIntro.value.content.invalid
        || this.postIngredients.value.ingredients.invalid
        || this.postProcess.value.difficulty.invalid
        || this.postProcess.value.timeToPrepare.invalid
        || this.postProcess.value.timeToCook.invalid
        || this.postProcess.value.steps.invalid
  }
  
  addIngredient() {
    const ingredientsArray = this.postIngredients.get('ingredients') as FormArray;
    ingredientsArray.push(this.createIngredientFormGroup());
  }

  createIngredientFormGroup(): FormGroup {
    return this._formBuilder.group({
      ingredient: ['', [Validators.required]],
      quantity: ['', [Validators.required]]
    })
  }

  removeIngredient(index: number) {
    const ingredientsArray = this.postIngredients.get('ingredients') as FormArray;
    ingredientsArray.removeAt(index);
  }

  addStep() {
    const stepsArray = this.postProcess.get('steps') as FormArray;
    stepsArray.push(this.createStepFormGroup());
  }

  createStepFormGroup(): FormGroup {
    return this._formBuilder.group({
      step: ['', [Validators.required]]
    });
  }

  removeStep(index: number) {
    const stepsArray = this.postProcess.get('steps') as FormArray;
    stepsArray.removeAt(index);
  }

  onSavePost() {
    if (this.checkPostValidity()) {
      return;
    }
    this.isLoading = true;
    console.log(this.mode);
    if (this.mode === "create") {
      this.postsService.addPost(
        this.postIntro.value.title, 
        this.postIntro.value.content,
        this.postIntro.value.image,
        this.postIngredients.value,
        this.postProcess.value);
    } else {
      console.log("editing post");
      this.postsService.updatePost(
        this.postId,
        this.postIntro.value.title,
        this.postIntro.value.content,
        this.postIntro.value.image,
        this.postIngredients.value,
        this.postProcess.value,
        this.post.likes
      );
    }
    this.postIntro.reset();
    this.postIngredients.reset();
    this.postProcess.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
