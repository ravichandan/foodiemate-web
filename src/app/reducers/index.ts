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

export interface State {
  address: Address;
  customer: CustomerInfo | undefined;
  popularItems: Item[] | undefined;
  popularPlaces: Place[] | undefined;
  cuisines: Cuisine[] | undefined;
  cuisinesItems: CuisinesItemsResponse | undefined;
  itemsData: { [k: string]: [Item] };
  placesData: { [k: string]: Place };
  postReview: NewReview | Review | undefined;
  correlationId: string | undefined;
  loggedIn: boolean;
  userInfo: any;
  error: any;
}

export const initialState: State = {
  address: {
    city: 'Sydney'
  } as Address,
  customer: undefined,
  popularItems: undefined,
  popularPlaces: undefined,
  cuisines: undefined,
  cuisinesItems: undefined,
  itemsData: {},
  placesData: {},
  postReview: {},
  correlationId: undefined,
  loggedIn: false,
  userInfo: undefined,
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
  on(FoodieActions.fetchPopularSuccess, (oldState, { popular }) =>
    popular?.items?.map((item: Item) => ({ ...item, type: 'item' }) as Item),
  ),
);
export const popularPlacesReducer = createReducer(
  initialState.popularPlaces,
  on(FoodieActions.fetchPopularSuccess, (oldState, { popular }) =>
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
      //     return unionBy(itm, ei, 'id').reverse();
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
    console.log('in newObj', place);
    const existingPlace = newObj[place._id];
    if (!existingPlace) {
      newObj[place._id] = place;
      return newObj;
    }

    newObj[place._id] = mergeWith({}, existingPlace, place, (ep, pl) => {
      if (isArray(ep)) {
        return unionBy(pl, ep, 'id').reverse();
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
    copy.place = form.placeCtrl?.id;
    copy.service = form.serviceCtrl;
    copy.ambience = form.ambienceCtrl;
    copy.description = form.descriptionCtrl;
    copy.medias = form.mediaCtrl && (form.mediaCtrl as Media[]);

    const itemGroups = Object.keys(form).filter((name) => name.startsWith('item') && name.endsWith('Group'));
    itemGroups?.length > 0 && (copy.children = []);
    itemGroups?.forEach((group) => {
      !!form[group].itemCtrl &&
        copy.children?.push({
          place: form.placeCtrl?.id,
          item: form[group].itemCtrl?.id,
          taste: form[group].tasteCtrl,
          presentation: form[group].presentationCtrl,
          description: form[group].itemReviewCtrl,
          medias: [].concat(form[group].mediaCtrl) as Media[],
        } as Review);
    });
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

export const userInfoReducer = createReducer(
  initialState.userInfo,
  on(FoodieActions.loginOidcCustomer, (oldState, newState) => {
    console.log('in userInfoReducer, newState: ', newState);
    return newState.userInfo;
  }),
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
  on(FoodieActions.updateLocation, (props: {   suburb?: string | undefined;   postcode?: string | undefined; } ) => ({
    suburb: props.suburb,
    postcode: props.postcode
  } as Address)),
);

export const reducers: ActionReducerMap<State> = {
  address: locationReducer,
  customer: customerReducer,
  popularItems: popularItemsReducer,
  popularPlaces: popularPlacesReducer,
  cuisines: cuisinesReducer,
  cuisinesItems: cuisinesItemsReducer,
  itemsData: itemDataReducer,
  placesData: placesDataReducer,
  postReview: preloadPostReviewReducer,
  correlationId: correlationIdReducer,
  loggedIn: loginReducer,
  userInfo: userInfoReducer,
  error: errorReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
