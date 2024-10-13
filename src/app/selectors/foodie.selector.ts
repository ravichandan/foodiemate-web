import { createSelector } from '@ngrx/store';
import { State } from '../reducers';
import { Item } from '../models/Item';
import { Place } from '../models/Place';
import { Address } from '../models/Address';
import { add } from 'lodash';

/**
 * Selector that selects the popular items&places
 *
 */
export const popularsSelectorOld = createSelector(
  (state: State) => state.popularItems,
  (state: State) => state.popularPlaces,
  (items: Array<Item> | undefined, places: Place[] | undefined) => {
    let all: any[] = [];
    if (!!items) {
      all = all.concat(items);
    }
    if (!!places) {
      all = all.concat(places);
    }
    return all.sort(() => 0.5 - Math.random());
  },
);

export const popularsSelector = () =>
  createSelector(
    (state: State) => state.popularPlaces,
    (places) => places,
  );


export const searchFilterSelector = () =>
  createSelector(
    (state: State) => state.address,
    (state: State) => state.cuisinesFilter,
    (state: State) => state.dietsFilter,
    (state: State) => state.distanceFilter,
    (state: State) => state.includeSuburbsFilter,
    (address, cuisines, diets, distance, includeSurroundingSuburbs) => {
      return {address, cuisines, diets, distance, includeSurroundingSuburbs};
    },
  );

  
export const cuisinesSelector = () =>
  createSelector(
    (state: State) => state.cuisines,
    (cuisines) => cuisines,
  );

export const suburbsSelector = () =>
  createSelector(
    (state: State) => state.suburbs,
    (suburbs) => suburbs,
  );

export const cuisinesItemsSelector = () =>
  createSelector(
    (state: State) => state.cuisinesItems,
    (cuisinesItems) => cuisinesItems,
  );
export const itemSelector = (id: string) =>
  createSelector(
    (state: State) => state.itemsData,
    (itemData) => {
      // console.log('in selector:: ,itemData:: ', itemData);
      // console.log('in selector:: ,id:: ', id);
      // console.log('in selector:: ,itemData[id]:: ', itemData[id]);
      return itemData[id];
    },
  );
export const placeSelector = (id: string) =>
  createSelector(
    (state: State) => state.placesData,
    (placesData) => {
      // console.log('in selector:: ,itemData:: ', itemData);
      // console.log('in selector:: ,id:: ', id);
      // console.log('in selector:: ,itemData[id]:: ', itemData[id]);
      return placesData[id];
    },
  );

export const addressSelector = () =>
  createSelector(
    (state: State) => state.address,
    (address: Address) => {
      // console.log('in selector:: ,itemData:: ', itemData);
      // console.log('in selector:: ,id:: ', id);
      // console.log('in selector:: ,itemData[id]:: ', itemData[id]);
      return address;
    },
  );


export const currentSuburbSelector = () =>
  createSelector(
    (state: State) => state.address,
    (address: Address) => address.suburb
  );

export const preloadReviewDataSelector = () =>
  createSelector(
    (state: State) => state,
    (state) => {
      return { postReview: state.postReview, token: state.userInfo?.token } ?? {};
    },
  );

export const postReviewResultSelector = () =>
  createSelector(
    (state: State) => state.postReview?._id,
    (id) => {
      return id;
    },
  );

export const customerSelector = () =>
  createSelector(
    (state: State) => state.customer,
    (customer) => customer,
  );

export const locationSelector = () =>
  createSelector(
    (state: State) => state.address,
    (address) => address.location,
  );
  
export const loggedInSelector = () =>
  createSelector(
    (state: State) => state.loggedIn,
    (loggedIn) => loggedIn,
  );

// export const verifiedCustomerSelector = () =>
//   createSelector(
//     (state: State) => state.customer, customer => customer?.,
//   );

export const itemDetailOfAPlaceSelector = (placeId: string, itemId: string) =>
  createSelector(
    (state: State) => state.placesData,
    (placesData) => {
      // console.log('in selector:: ,itemData:: ', itemData);
      // console.log('in selector:: ,id:: ', id);
      console.log('in selector:: ,placesData[placeId]?.items:: ', placesData[placeId]?.items);
      const item = placesData[placeId]?.items?.find(it => it._id===itemId);
      if (!item) return undefined;
      return { ...placesData[placeId], items: [item] } as Place;
    },
  );

export const placeItemFromItemDataSelector = (placeId: string, itemId: string) =>
  createSelector(
    (state: State) => state.itemsData,
    (itemsData) => {
      console.log('in placeItemFromItemDataSelector:: ,itemsData:: ', itemsData);
      console.log('in placeItemFromItemDataSelector:: ,placeId:: ', placeId);
      console.log('in placeItemFromItemDataSelector:: ,itemId:: ', itemId);
      // console.log('in selector:: ,itemData[id]:: ', itemData[id]);
      if (!itemsData[itemId]) return undefined;
      return itemsData[itemId]?.find(entry => entry.places?.[0]._id === placeId);
      // return { ...itemsData[placeId], items: { [itemId]: itemsData[placeId]?.items?.[itemId] } } as Place;
    },
  );
