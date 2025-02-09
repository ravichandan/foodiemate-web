import { isDevMode } from '@angular/core';
import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import * as FoodieActions from '../actions/foodie.actions';
import { Item } from '../models/Item';
import { Place } from '../models/Place';
import { Cuisine } from '../models/Cuisine';
import { CuisinesItems, CuisinesItemsResponse } from '../models/CuisinesItemsResponse';
import { isArray, mergeWith, unionBy, uniqWith } from 'lodash';
import { NewReview, Review } from '../models/Review';
import { Media } from '../models/Media';
import { CustomerInfo } from '../models/CustomerInfo';
import { Address } from '../models/Address';
import { SuburbsResponse } from '../models/SuburbsResponse';
import { Location } from '../models/Location';

export interface State {
  address: Address;
  cuisinesFilter: any[]|undefined;
  dietsFilter: any[]|undefined;
  distanceFilter: number|undefined;
  includeSuburbsFilter: boolean|undefined;
  customer: CustomerInfo | undefined;
  popularItems: Item[] | undefined;
  popularPlaces: Place[] | undefined;
  cuisines: Cuisine[] | undefined;
  suburbs: SuburbsResponse | undefined;
  cuisinesItems: CuisinesItemsResponse | undefined;
  itemsData: { [k: string]: [Item] };
  placesData: { [k: string]: Place };
  postReview: NewReview | Review | undefined;
  correlationId: string | undefined;
  loggedIn: boolean;
  userInfo: any;
  processing: boolean;
  error: any;
}

export const initialState: State = {
  address: {
    city: 'Sydney'
  } as Address,
  customer: undefined,
  cuisinesFilter: undefined,
  dietsFilter: undefined,
  distanceFilter: undefined,
  includeSuburbsFilter: undefined,
  popularItems: [],
  popularPlaces: undefined,
  cuisines: undefined,
  suburbs: undefined,
  cuisinesItems: undefined,
  itemsData: {},
  placesData: {},
  postReview: {},
  correlationId: undefined,
  loggedIn: false,
  userInfo: undefined,
  processing: false,
  error: undefined,
};

export const customerReducer = createReducer(
  initialState.customer,
  on(FoodieActions.loginCustomerSuccess, (oldState, { customer }) => ({ ...customer })),
  on(FoodieActions.loginOidcCustomerSuccess, (oldState, { customer }) => ({ ...customer })),
  on(FoodieActions.oidcTokenFetchedSuccess, (oldState, { userInfo }) => ({ ...oldState, id: '1', name: userInfo.info.given_name + ' '+ userInfo.info.family_name, email: userInfo.info.email} as CustomerInfo)),
);

export const popularItemsReducer = createReducer(
  initialState.popularItems,
  on(FoodieActions.fetchPopularItemsSuccess, (oldState, { popular, replace }) =>
    replace 
      ? popular?.items?.map((item: Item) => ({ ...item }) as Item)
      : oldState?.concat(popular?.items?.map((item: Item) => ({ ...item }) as Item))
    ,
  ),
);

export const popularPlacesReducer = createReducer(
  initialState.popularPlaces,
  on(FoodieActions.fetchPopularPlacesSuccess, (oldState, { popular }) =>
    popular?.places?.map(
      (place: Place) =>
        ({
          ...place,
          type: 'place',
        }) as Place,
    ),
  ),
);

export const cuisinesReducer = createReducer(
  initialState.cuisines,
  on(FoodieActions.fetchCuisinesSuccess, (oldState, { cuisinesResponse }) => [...cuisinesResponse.cuisines]),
);

export const suburbsReducer = createReducer(
  initialState.suburbs,
  on(FoodieActions.fetchSuburbsSuccess, (oldState, { suburbsResponse }) => suburbsResponse),
);

export const cuisinesItemsReducer = createReducer(
  initialState.cuisinesItems,
  on(
    FoodieActions.fetchCuisinesItemsSuccess,
    (oldState: CuisinesItemsResponse | undefined, { cuisinesItemsResponse }) => {
      if (!!oldState?.data) {
        const elements: CuisinesItems[] = [...oldState.data, ...cuisinesItemsResponse.data];

        const uniques: CuisinesItems[] = uniqWith(elements, (el1, el2) => el1.id === el2.id);

        return { data: uniques };
      }
      return cuisinesItemsResponse;
    },
  ),
);

export const itemDataReducer = createReducer(
  initialState.itemsData,
  on(FoodieActions.fetchPlacesOfItemSuccess, (oldState: { [_: string]: [Item] }, { itemResponse }) => {
    const newObj = { ...oldState };
    console.log('in index.ts->itemDataReducer, itemResponse:: ', itemResponse);
    for(const item of itemResponse.items) {
      console.log('in newObj', item);
      const existingItem = newObj[item._id];
      if (!existingItem) {
        newObj[item._id] = [item];
        console.log('============retuning new newObj:: ', newObj);
        // return newObj;

        continue;
      }
      console.log('============Updating item places, before update existingItem.length:: ', existingItem.length);

      if(existingItem.findIndex(it => it.placeItemId === item.placeItemId) === -1) {
        existingItem.push(item);
      }
      // newObj[item._id] = mergeWith({}, existingItem, item, (ei, itm) => {
      //   if (isArray(ei)) {
      //     return unionBy(itm, ei, '_id').reverse();
      //   }
      //   return itm as Item;
      // });
      console.log('==============Updated item places, after update existingItem.length:: ', newObj[item._id].length);

    }

    return newObj;
  }),
);

export const placesDataReducer = createReducer(
  initialState.placesData,
  on(FoodieActions.fetchPlaceSuccess, (oldState: { [_: string]: Place }, { place }) => {
    const newObj = { ...oldState };
    console.log('in placesDataReducer -> newObj', place);
    const existingPlace = newObj[place._id];
    if (!existingPlace) {
      newObj[place._id] = place;
      return newObj;
    }

    newObj[place._id] = mergeWith({}, existingPlace, place, (ep, pl) => {
      if (isArray(ep)) {
        return unionBy(pl, ep, '_id').reverse();
      }
      return pl;
    });

    return newObj;
  }),
  on(FoodieActions.fetchItemOfAPlaceSuccess, (oldState: { [_: string]: Place },
                                              { response }) => {
    console.log('in index.ts-> on fetchItemOfAPlaceSuccess, response:: ', response);
    const copy = { ...oldState };
    const place: Place = response.places?.[0];
    console.log('in reducer -> fetchItemOfAPlaceSuccess, oldState copy :: ', copy);
    const existingPlace = copy[place._id];
    const item = place.items[0];
    if (!existingPlace) {
      console.log('in reducer -> fetchItemOfAPlaceSuccess, inside If ', copy);
      copy[place._id] = {
        ...place,
        items: [item],
      } as Place;
      return copy;
    }
    let index = copy[place._id].items.findIndex(it=> it._id==item._id);

    const items = [...copy[place._id].items];
    if (index !== -1) {
      items[index] = item;
    } else {
      items.push(item);
    }
    copy[place._id] = { ...copy[place._id], items: items };
    // copy[place._id] = { ...copy[place._id], items: { ...copy[place._id].items, [item._id]: { ...item } } };
    return copy;
  }),
  on(FoodieActions.feedbackReviewSuccess, (oldState: { [_: string]: Place }, { review }) => {
    const copy = { ...oldState };
    const placeId = review.place?._id ?? review.place;
    const items = copy[placeId].items;
    const itemId: string| undefined = items.find(item => item.placeItem?._id === (review.placeItem?._id ??  review.placeItem))?._id;
    const item: Item| undefined = items.find(item => item.placeItem?._id === (review.placeItem?._id ??  review.placeItem));
    if(itemId && item) {

      const reviewsObj = item.placeItem.reviews;
      // items[itemId].placeItem.reviews = [...reviewsObj.map((r: Review) => (r._id === review._id ? review : r))];
      const result = {
        ...copy,
        [placeId]: {
          ...copy[placeId],
          items: {
            ...items.map((it) => it._id !== item._id ? it : {
              ...item,
              placeItem: {
                ...item.placeItem,
                reviews: item.placeItem.reviews.map((r: Review) => (r._id === review._id ? review : r))
              }
            })
            // [itemId]: {
            //   ...item,
            //   placeItem: {
            //     ...items[itemId].placeItem,
            //     reviews: items[itemId].placeItem.reviews.map((r: Review) => (r._id === review._id ? review : r))
            //   }
          },

        }
      }
      return result;
    }
    return copy;
  }),
);

export const preloadPostReviewReducer = createReducer(
  initialState.postReview,
  on(
    FoodieActions.preloadPostReviewData,
    (
      oldState: NewReview | undefined,
      props: {
        review?: NewReview;
        place?: Place;
        item?: Item;
      },
    ) => {
      let copy = oldState ? { ...oldState } : ({} as Review);
      copy = {
        ...copy,
        ...props.review,
        place: props.place ?? copy.place ?? '',
        item: props.item ?? copy.item ?? '',
      } as NewReview;
      return copy;
    },
  ),
  on(FoodieActions.updateNewPostReviewState, (oldState: NewReview | undefined, { form }) => {
    console.log('in reducer->updateNewPostReviewState, form:: ', form);
    const copy = oldState ? { ...oldState } : ({} as Review);
    copy.place = form.placeCtrl?._id;
    copy.service = form.serviceCtrl;
    copy.ambience = form.ambienceCtrl;
    copy.description = form.descriptionCtrl;
    copy.medias = form.mediaCtrl && (form.mediaCtrl as Media[]);

    const itemGroups = Object.keys(form).filter((name) => name.startsWith('item') && name.endsWith('Group'));
    itemGroups?.length > 0 && (copy.children = []);
    itemGroups?.forEach((group) => {
      !!form[group].itemCtrl &&
        copy.children?.push({
          place: form.placeCtrl?._id,
          item: form[group].itemCtrl?._id,
          taste: form[group].tasteCtrl,
          presentation: form[group].presentationCtrl,
          description: form[group].itemReviewCtrl,
          medias: [].concat(form[group].mediaCtrl) as Media[],
        } as Review);
    });
    // console.log('put a break point here, copy:: ', copy);
    return copy;
  }),
  on(FoodieActions.newPostReviewSuccess, (oldState: NewReview | undefined, { review }) => {
    console.log('in reducer, newPostReviewSuccess, review:: ', review);
    let copy = { ...oldState, ...review };
    copy.id = review._id ?? (review as any)._id;
    return copy;
  }),
);

export const correlationIdReducer = createReducer(
  initialState.correlationId,
  on(FoodieActions.storeCorrelationId, (oldState: string | undefined, { correlationId }) => correlationId),
);

export const loginReducer = createReducer(
  initialState.loggedIn,
  on(FoodieActions.loginCustomerSuccess, FoodieActions.loginOidcCustomerSuccess, (_: boolean) => true),
  on(FoodieActions.logoutCustomerSuccess, (_: boolean) => false),
);

export const cuisinesFilterReducer = createReducer(
  initialState.cuisinesFilter,
  // on(FoodieActions.cuisinesFilterChange, (cuisines: any[]|undefined) => cuisines),
  on(FoodieActions.cuisinesFilterChange, (oldState, newState) => newState.cuisines),
);

export const dietsFilterReducer = createReducer(
  initialState.dietsFilter,
  on(FoodieActions.dietsFilterChange, (oldState, newState) => newState.diets),
);

export const distanceFilterReducer = createReducer(
  initialState.distanceFilter,
  on(FoodieActions.distanceFilterChange, (oldState, newState) => newState.distance),
);

export const surroundingSuburbsFilterReducer = createReducer(
  initialState.includeSuburbsFilter,
  on(FoodieActions.includeSurroundingSuburbsFilterChange, (include: boolean|undefined) => include),
);

export const userInfoReducer = createReducer(
  initialState.userInfo,
  on(FoodieActions.loginOidcCustomer, (oldState, newState) => {
    console.log('in userInfoReducer, newState: ', newState);
    return newState.userInfo;
  }),
);
export const processingReducer = createReducer(
  initialState.processing,
  on(FoodieActions.fetchPlacesOfItem, (oldState, {  }) =>  true ),
  on(FoodieActions.fetchPopularItems, (oldState, {  }) =>  true ),
  on(FoodieActions.fetchPopularPlaces, (oldState, {  }) =>  true ),

  on(FoodieActions.fetchPlacesOfItemSuccess, (oldState, {  }) =>  false ),
  on(FoodieActions.fetchPopularItemsSuccess, (oldState, {  }) =>  false ),
  on(FoodieActions.fetchPopularPlacesSuccess, (oldState, {  }) =>  false ),
  
);

export const errorReducer = createReducer(
  initialState.error,
  on(FoodieActions.failed, (oldState, { error }) => ({
    ...error,
  })),
  on(FoodieActions.newPostReview, (oldState, { }) => ({
    undefined
  })),
  on(FoodieActions.clearError, (oldState, { }) => ({
    undefined
  })),
);

export const locationReducer = createReducer(
  initialState.address,
  // on(FoodieActions.updateLocation,
  on(FoodieActions.updateLocation, (oldState, newState) => ({
    ...oldState,
    ...newState
  } as Address)),
);

export const reducers: ActionReducerMap<State> = {
  address: locationReducer,
  customer: customerReducer,
  popularItems: popularItemsReducer,
  popularPlaces: popularPlacesReducer,
  cuisinesFilter: cuisinesFilterReducer,
  dietsFilter: dietsFilterReducer,
  distanceFilter: distanceFilterReducer,
  includeSuburbsFilter: surroundingSuburbsFilterReducer,
  cuisines: cuisinesReducer,
  suburbs: suburbsReducer,
  cuisinesItems: cuisinesItemsReducer,
  itemsData: itemDataReducer,
  placesData: placesDataReducer,
  postReview: preloadPostReviewReducer,
  correlationId: correlationIdReducer,
  loggedIn: loginReducer,
  userInfo: userInfoReducer,
  processing: processingReducer,
  error: errorReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
