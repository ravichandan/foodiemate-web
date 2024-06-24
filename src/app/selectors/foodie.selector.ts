import { createSelector } from '@ngrx/store';
import { State } from '../reducers';
import { Item } from '../models/Item';
import { Place } from '../models/Place';

/**
 * Selector that selects the popular items&places
 *
 */
export const popularsSelector = createSelector(
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

export const cuisinesSelector = () =>
  createSelector(
    (state: State) => state.cuisines,
    (cuisines) => cuisines,
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

export const preloadReviewDataSelector = () =>
  createSelector(
    (state: State) => state.postReview,
    (postReview) => {
      return postReview ?? {};
    },
  );
export const postReviewResultSelector = () =>
  createSelector(
    (state: State) => state.postReview?.id,
    (id) => {
      return id;
    },
  );

export const customerSelector = () =>
  createSelector(
    (state: State) => state.customer,
    (customer) => customer,
  );

export const loginSelector = () =>
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
      // console.log('in selector:: ,itemData[id]:: ', itemData[id]);
      if (!placesData[placeId]?.items?.[itemId]) return undefined;
      return { ...placesData[placeId], items: { [itemId]: placesData[placeId]?.items?.[itemId] } } as Place;
    },
  );
