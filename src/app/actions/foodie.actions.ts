import { createAction, props } from '@ngrx/store';
import { PopularResponse } from '../models/PopularResponse';
import { CuisinesResponse } from '../models/CuisinesResponse';
import { CuisinesItemsResponse } from '../models/CuisinesItemsResponse';
import { Item } from '../models/Item';
import { Place } from '../models/Place';
import { NewReview, Review } from '../models/Review';
import { PlacesResponse } from '../models/PlacesResponse';
import { CustomerInfo } from '../models/CustomerInfo';
import { ItemResponse } from '../models/ItemResponse';
import { SuburbsResponse } from '../models/SuburbsResponse';
import { Location } from '../models/Location';

export const ACTION_FETCH_POPULAR_REQUESTED = '[FoodieMate] Fetch Popular Requested';
export const ACTION_FETCH_POPULAR_ITEMS = '[FoodieMate] Fetch Popular Items';
export const ACTION_FETCH_POPULAR_PLACES = '[FoodieMate] Fetch Popular Places';
export const ACTION_FETCH_POPULAR_ITEMS_SUCCESS = '[FoodieMate] Fetch Popular Items Success';
export const ACTION_FETCH_POPULAR_PLACES_SUCCESS = '[FoodieMate] Fetch Popular Places Success';
export const ACTION_FETCH_CUISINES = '[FoodieMate] Fetch CUISINES';
export const ACTION_FETCH_CUISINES_SUCCESS = '[FoodieMate] Fetch CUISINES Success';
export const ACTION_FETCH_SUBURBS = '[FoodieMate] Fetch SUBURBS';
export const ACTION_FETCH_SUBURBS_SUCCESS = '[FoodieMate] Fetch SUBURBS Success';
export const ACTION_FETCH_CUISINES_ITEMS = '[FoodieMate] Fetch CUISINES ITEMS';
export const ACTION_FETCH_CUISINES_ITEMS_SUCCESS = '[FoodieMate] Fetch CUISINES ITEMS Success';

export const ACTION_FETCH_ITEM = '[FoodieMate] Fetch ITEM';
export const ACTION_FETCH_ITEM_SUCCESS = '[FoodieMate] Fetch ITEM Success';

export const ACTION_FETCH_PLACE = '[FoodieMate] Fetch PLACE';
export const ACTION_FETCH_PLACE_SUCCESS = '[FoodieMate] Fetch PLACE Success';

export const ACTION_FETCH_PLACES_WITH_NAME = '[FoodieMate] Fetch PLACES WITH NAME';
export const ACTION_FETCH_PLACES_WITH_NAME_SUCCESS = '[FoodieMate] Fetch PLACES WITH NAME Success';

export const ACTION_FETCH_PLACES_OF_ITEM = '[FoodieMate] Fetch PLACES OF ITEM';
export const ACTION_FETCH_PLACES_OF_ITEM_SUCCESS = '[FoodieMate] Fetch PLACES OF ITEM Success';
export const ACTION_FETCH_ITEM_OF_A_PLACE = '[FoodieMate] Fetch ITEM OF A PLACE';
export const ACTION_FETCH_ITEM_OF_A_PLACE_SUCCESS = '[FoodieMate] Fetch ITEM OF A PLACE Success';

export const ACTION_STORE_CORRELATION_ID = '[FoodieMate] UPLOAD FILE';
export const ACTION_UPLOAD_FILE_SUCCESS = '[FoodieMate] UPLOAD FILE Success';

export const ACTION_LIKE_REVIEW = '[FoodieMate] Fetch LIKE REVIEW';
export const ACTION_DISLIKE_REVIEW = '[FoodieMate] Fetch DISLIKE REVIEW';
export const ACTION_UNLIKE_REVIEW = '[FoodieMate] Fetch UNLIKE REVIEW';
export const ACTION_UNDISLIKE_REVIEW = '[FoodieMate] Fetch UNDISLIKE REVIEW';
export const ACTION_FEEDBACK_REVIEW_SUCCESS = '[FoodieMate] Fetch FEEDBACK REVIEW SUCCESS';
export const ACTION_UPDATE_NEW_POST_REVIEW_STATE = '[FoodieMate] UPDATE NEW POST REVIEW STATE';
export const ACTION_NEW_POST_REVIEW = '[FoodieMate] NEW POST REVIEW';
export const ACTION_NEW_POST_REVIEW_SUCCESS = '[FoodieMate] NEW POST REVIEW SUCCESS';
export const ACTION_PRELOAD_POST_REVIEW = '[FoodieMate] PRELOAD POST REVIEW';

export const ACTION_CUISINES_FILTER_CHANGE = '[FoodieMate] CUISINES FILTER CHANGE';
export const ACTION_DIETS_FILTER_CHANGE = '[FoodieMate] DIETS FILTER CHANGE';
export const ACTION_DISTANCE_FILTER_CHANGE = '[FoodieMate] DISTANCE FILTER CHANGE';
export const ACTION_SURROUNDING_SUBURBS_FILTER_CHANGE = '[FoodieMate] SURROUNDING SUBURBS FILTER CHANGE';

export const ACTION_LOGIN_OIDC_CUSTOMER = '[FoodieMate] LOGIN OIDC CUSTOMER';
export const ACTION_LOGIN_OIDC_CUSTOMER_SUCCESS = '[FoodieMate] LOGIN OIDC CUSTOMER SUCCESS';
export const ACTION_OIDC_TOKEN_FETCHED_SUCCESS = '[FoodieMate] OIDC TOKEN FETCHED SUCCESS';

export const ACTION_CUSTOMER_LOGIN = '[FoodieMate] CUSTOMER LOGIN';
export const ACTION_CUSTOMER_LOGIN_SUCCESS = '[FoodieMate] CUSTOMER LOGIN SUCCESS';

export const ACTION_UPDATE_CUSTOMER = '[FoodieMate] UPDATE CUSTOMER';
export const ACTION_UPDATE_CUSTOMER_SUCCESS = '[FoodieMate] UPDATE CUSTOMER SUCCESS';

export const ACTION_CUSTOMER_LOGOUT = '[FoodieMate] CUSTOMER LOGOUT';
export const ACTION_CUSTOMER_LOGOUT_SUCCESS = '[FoodieMate] CUSTOMER LOGOUT SUCCESS';
export const ACTION_ASK_FOR_VERIFICATION = '[FoodieMate] ASK CUSTOMER FOR VERIFICATION';

export const ACTION_PROCESSING = '[FoodieMate] PROCESSING';
export const ACTION_PROCESSING_DONE = '[FoodieMate] PROCESSING DONE';


// export const ACTION_CHANGE_LOCATION = '[FoodieMate] CHANGE LOCATION';

export const ACTION_UPDATE_ADDRESS = '[FoodieMate] UPDATE ADDRESS';
export const ACTION_CLEAR_ERROR = '[FoodieMate] CLEAR ERROR';

export const ACTION_FAILED = '[FoodieMate] Failed';
export const ACTION_PAGE_DESTROYED = '[FoodieMate] Page Destroyed';

export const fetchPopularItems = createAction(ACTION_FETCH_POPULAR_ITEMS);
export const fetchPopularPlaces = createAction(ACTION_FETCH_POPULAR_PLACES);

export const fetchPopularItemsSuccess = createAction(ACTION_FETCH_POPULAR_ITEMS_SUCCESS, props<{ popular: PopularResponse }>());
export const fetchPopularPlacesSuccess = createAction(ACTION_FETCH_POPULAR_PLACES_SUCCESS, props<{ popular: PopularResponse }>());

export const processing = createAction(ACTION_PROCESSING);

export const processingDone = createAction(ACTION_PROCESSING_DONE);


export const cuisinesFilterChange = createAction(ACTION_CUISINES_FILTER_CHANGE,
  props<{ cuisines: any[] }>(),
);
export const dietsFilterChange = createAction(ACTION_DIETS_FILTER_CHANGE,
  props<{ diets: any[] }>(),
);
export const distanceFilterChange = createAction(ACTION_DISTANCE_FILTER_CHANGE,
  props<{ distance: number }>(),
);
export const includeSurroundingSuburbsFilterChange = createAction(ACTION_SURROUNDING_SUBURBS_FILTER_CHANGE,
  props<{ include: boolean }>(),
);

export const fetchCuisines = createAction(ACTION_FETCH_CUISINES);
export const fetchSuburbs = createAction(ACTION_FETCH_SUBURBS, props<{ city: string }>());

// export const changeLocation = createAction(ACTION_CHANGE_LOCATION, props<{ latitude: number, longitude: number }>());

export const fetchCuisinesSuccess = createAction(
  ACTION_FETCH_CUISINES_SUCCESS,
  props<{ cuisinesResponse: CuisinesResponse }>(),
);

export const fetchSuburbsSuccess = createAction(
  ACTION_FETCH_SUBURBS_SUCCESS,
  props<{ suburbsResponse: SuburbsResponse }>(),
);

export const fetchCuisinesItems = createAction(ACTION_FETCH_CUISINES_ITEMS);

export const fetchCuisinesItemsSuccess = createAction(
  ACTION_FETCH_CUISINES_ITEMS_SUCCESS,
  props<{ cuisinesItemsResponse: CuisinesItemsResponse }>(),
);

export const fetchItem = createAction(ACTION_FETCH_ITEM, props<{ id: string }>());

export const fetchItemSuccess = createAction(ACTION_FETCH_ITEM_SUCCESS, props<{ item: Item }>());

export const fetchPlace = createAction(ACTION_FETCH_PLACE, props<{ id: string; fetchMenu?: boolean; fetchReviews?: boolean }>());

export const fetchPlaceSuccess = createAction(ACTION_FETCH_PLACE_SUCCESS, props<{ place: Place }>());

export const fetchPlacesWithName = createAction(ACTION_FETCH_PLACES_WITH_NAME, props<{ name: string }>());

export const fetchPlacesWithNameSuccess = createAction(
  ACTION_FETCH_PLACES_WITH_NAME_SUCCESS,
  props<{ placesResponse: PlacesResponse }>(),
);

export const fetchPlacesOfItem = createAction(
  ACTION_FETCH_PLACES_OF_ITEM,
  props<{ id: string; city: string; suburb?: string; postcode?:string; pageSize?: number; pageNum?: number }>(),
);

export const fetchPlacesOfItemSuccess = createAction(ACTION_FETCH_PLACES_OF_ITEM_SUCCESS, props<{ itemResponse: ItemResponse }>());

export const loginCustomer = createAction(
  ACTION_CUSTOMER_LOGIN,
  // props<{  }>(),
);

export const loginCustomerSuccess = createAction(ACTION_CUSTOMER_LOGIN_SUCCESS, props<{ customer: CustomerInfo }>());

export const updateCustomer = createAction(
  ACTION_UPDATE_CUSTOMER,
  // props<{  }>(),
);

export const updateCustomerSuccess = createAction(ACTION_UPDATE_CUSTOMER_SUCCESS, props<{ customer: CustomerInfo }>());

export const loginOidcCustomer = createAction(
  ACTION_LOGIN_OIDC_CUSTOMER,
  props<{ userInfo: any }>(),
);

export const loginOidcCustomerSuccess = createAction(
  ACTION_LOGIN_OIDC_CUSTOMER_SUCCESS,
  props<{ customer: CustomerInfo }>(),
);

export const oidcTokenFetchedSuccess = createAction(
  ACTION_OIDC_TOKEN_FETCHED_SUCCESS,
  props<{ userInfo: any }>(),
);

export const logoutCustomer = createAction(ACTION_CUSTOMER_LOGOUT);

export const logoutCustomerSuccess = createAction(ACTION_CUSTOMER_LOGOUT_SUCCESS);

export const askForVerification = createAction(ACTION_ASK_FOR_VERIFICATION, props<{ customer: CustomerInfo }>());
export const fetchItemOfAPlace = createAction(
  ACTION_FETCH_ITEM_OF_A_PLACE,
  props<{ placeId?: string; itemId?: string; placeItemId?: string; pageSize?: number; pageNum?: number }>(),
);

export const fetchItemOfAPlaceSuccess = createAction(
  ACTION_FETCH_ITEM_OF_A_PLACE_SUCCESS,
  // props<{ response: {placeId: string, item: Item} }>()
  props<{ response: PlacesResponse }>(),
);

export const likeReview = createAction(ACTION_LIKE_REVIEW, props<{ reviewId: string}> ());

export const dislikeReview = createAction(ACTION_DISLIKE_REVIEW, props<{ reviewId: string }>());

export const unlikeReview = createAction(ACTION_UNLIKE_REVIEW, props<{ reviewId: string }>());

export const undislikeReview = createAction(ACTION_UNDISLIKE_REVIEW, props<{ reviewId: string }>());

export const feedbackReviewSuccess = createAction(ACTION_FEEDBACK_REVIEW_SUCCESS, props<{ review: Review }>());

export const newPostReview = createAction(
  ACTION_NEW_POST_REVIEW,
  // props<{ review: NewReview } >(),
);

export const updateNewPostReviewState = createAction(ACTION_UPDATE_NEW_POST_REVIEW_STATE, props<{ form: any }>());

export const newPostReviewSuccess = createAction(ACTION_NEW_POST_REVIEW_SUCCESS, props<{ review: any }>());

export const preloadPostReviewData = createAction(
  ACTION_PRELOAD_POST_REVIEW,
  props<{ review?: NewReview; place?: Place; item?: Item }>(),
);

export const clearError = createAction(ACTION_CLEAR_ERROR);

export const updateLocation = createAction(ACTION_UPDATE_ADDRESS, props<{ suburb?: string; postcode?: string; location?: Location;  }>());

export const storeCorrelationId = createAction(ACTION_STORE_CORRELATION_ID, props<{ correlationId: string }>());
export const failed = createAction(ACTION_FAILED, props<{ error: any }>());

export const pageDestroyed = createAction(ACTION_PAGE_DESTROYED);
