import { createAction, props } from '@ngrx/store';
import { PopularResponse } from '../models/PopularResponse';
import { CuisinesResponse } from '../models/CuisinesResponse';
import { CuisinesItemsResponse } from '../models/CuisinesItemsResponse';
import { Item } from '../models/Item';
import { Place } from '../models/Place';
import { NewReview, Review } from '../models/Review';
import { PlacesResponse } from '../models/PlacesResponse';
import { CustomerInfo } from '../models/CustomerInfo';

export const ACTION_FETCH_POPULAR_REQUESTED = '[FoodieMate] Fetch Popular Requested';
export const ACTION_FETCH_POPULAR = '[FoodieMate] Fetch Popular';
export const ACTION_FETCH_POPULAR_SUCCESS = '[FoodieMate] Fetch Popular Success';
export const ACTION_FETCH_CUISINES = '[FoodieMate] Fetch CUISINES';
export const ACTION_FETCH_CUISINES_SUCCESS = '[FoodieMate] Fetch CUISINES Success';
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

export const ACTION_LOGIN_OIDC_CUSTOMER = '[FoodieMate] LOGIN OIDC CUSTOMER';
export const ACTION_LOGIN_OIDC_CUSTOMER_SUCCESS = '[FoodieMate] LOGIN OIDC CUSTOMER SUCCESS';

export const ACTION_CUSTOMER_LOGIN = '[FoodieMate] CUSTOMER LOGIN';
export const ACTION_CUSTOMER_LOGIN_SUCCESS = '[FoodieMate] CUSTOMER LOGIN SUCCESS';

export const ACTION_UPDATE_CUSTOMER = '[FoodieMate] UPDATE CUSTOMER';
export const ACTION_UPDATE_CUSTOMER_SUCCESS = '[FoodieMate] UPDATE CUSTOMER SUCCESS';

export const ACTION_CUSTOMER_LOGOUT = '[FoodieMate] CUSTOMER LOGOUT';
export const ACTION_CUSTOMER_LOGOUT_SUCCESS = '[FoodieMate] CUSTOMER LOGOUT SUCCESS';
export const ACTION_ASK_FOR_VERIFICATION = '[FoodieMate] ASK CUSTOMER FOR VERIFICATION';

export const ACTION_UPDATE_ADDRESS = '[FoodieMate] UPDATE ADDRESS';
export const ACTION_CLEAR_ERROR = '[FoodieMate] CLEAR ERROR';

export const ACTION_FAILED = '[FoodieMate] Failed';
export const ACTION_PAGE_DESTROYED = '[FoodieMate] Page Destroyed';

export const fetchPopular = createAction(ACTION_FETCH_POPULAR);

export const fetchPopularSuccess = createAction(ACTION_FETCH_POPULAR_SUCCESS, props<{ popular: PopularResponse }>());

export const fetchCuisines = createAction(ACTION_FETCH_CUISINES);

export const fetchCuisinesSuccess = createAction(
  ACTION_FETCH_CUISINES_SUCCESS,
  props<{ cuisinesResponse: CuisinesResponse }>(),
);

export const fetchCuisinesItems = createAction(ACTION_FETCH_CUISINES_ITEMS);

export const fetchCuisinesItemsSuccess = createAction(
  ACTION_FETCH_CUISINES_ITEMS_SUCCESS,
  props<{ cuisinesItemsResponse: CuisinesItemsResponse }>(),
);

export const fetchItem = createAction(ACTION_FETCH_ITEM, props<{ id: string }>());

export const fetchItemSuccess = createAction(ACTION_FETCH_ITEM_SUCCESS, props<{ item: Item }>());

export const fetchPlace = createAction(ACTION_FETCH_PLACE, props<{ id: string }>());

export const fetchPlaceSuccess = createAction(ACTION_FETCH_PLACE_SUCCESS, props<{ place: Place }>());

export const fetchPlacesWithName = createAction(ACTION_FETCH_PLACES_WITH_NAME, props<{ name: string }>());

export const fetchPlacesWithNameSuccess = createAction(
  ACTION_FETCH_PLACES_WITH_NAME_SUCCESS,
  props<{ placesResponse: PlacesResponse }>(),
);

export const fetchPlacesOfItem = createAction(
  ACTION_FETCH_PLACES_OF_ITEM,
  props<{ id: string; pageSize?: number; pageNum?: number }>(),
);

export const fetchPlacesOfItemSuccess = createAction(ACTION_FETCH_PLACES_OF_ITEM_SUCCESS, props<{ item: Item }>());

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

export const logoutCustomer = createAction(ACTION_CUSTOMER_LOGOUT);

export const logoutCustomerSuccess = createAction(ACTION_CUSTOMER_LOGOUT_SUCCESS);

export const askForVerification = createAction(ACTION_ASK_FOR_VERIFICATION, props<{ customer: CustomerInfo }>());
export const fetchItemOfAPlace = createAction(
  ACTION_FETCH_ITEM_OF_A_PLACE,
  props<{ placeId: string; itemId: string; pageSize?: number; pageNum?: number }>(),
);

export const fetchItemOfAPlaceSuccess = createAction(
  ACTION_FETCH_ITEM_OF_A_PLACE_SUCCESS,
  // props<{ response: {placeId: string, item: Item} }>()
  props<{ response: { place: Place; itemId: string } }>(),
);

export const likeReview = createAction(ACTION_LIKE_REVIEW, props<{ reviewId: string; customerId: string }>());

export const dislikeReview = createAction(ACTION_DISLIKE_REVIEW, props<{ reviewId: string; customerId: string }>());

export const unlikeReview = createAction(ACTION_UNLIKE_REVIEW, props<{ reviewId: string; customerId: string }>());

export const undislikeReview = createAction(ACTION_UNDISLIKE_REVIEW, props<{ reviewId: string; customerId: string }>());

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

export const updateLocation = createAction(ACTION_UPDATE_ADDRESS, props<{ suburb?: string; postcode?: string }>());

export const storeCorrelationId = createAction(ACTION_STORE_CORRELATION_ID, props<{ correlationId: string }>());
export const failed = createAction(ACTION_FAILED, props<{ error: any }>());

export const pageDestroyed = createAction(ACTION_PAGE_DESTROYED);
