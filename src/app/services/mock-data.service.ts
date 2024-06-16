import { Injectable } from '@angular/core';
import { Response, Server } from 'miragejs';
import * as popularSearches from '../../../mock-data/popular-searches.json';
import * as cuisines from '../../../mock-data/cuisines.json';
import * as cuisinesItems from '../../../mock-data/cuisines_items.json';
import * as itemPlaces from '../../../mock-data/single_item_places.json';
import * as itemInAPlace from '../../../mock-data/single_place_item_detail.json';
import * as itemInAPlaceMoreReviews from '../../../mock-data/single_place_item_detail_more_reviews.json';
import * as place from '../../../mock-data/single_place.json';
import * as placesAbc from '../../../mock-data/places_abc.json';
import * as newReview from '../../../mock-data/post_new_review.json';
import * as mediaResponse from '../../../mock-data/upload_media_response.json';
import * as customer from '../../../mock-data/customer.json';
import config from '../../config.json';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({ providedIn: 'any' })
export class MockDataService {
  constructor() {}

  public setRouteHandlers(server: Server): void {
    // console.log('setting route handlers in mock data service');
    server.namespace = config.urlPrefix;
    server.urlPrefix = config.host;

    server.passthrough('https://accounts.google.com/**');
    server.passthrough('https://openidconnect.googleapis.com/**');
    server.passthrough('https://oauth2.googleapis.com/**');
    server.passthrough('https://www.googleapis.com//**');
    // server.passthrough('http://127.0.0.1:3000/api/popular-searches');
    // server.passthrough('/popular-searches');
    server.get('/popular-searches', () => {
      // console.log('entered xxxxxxxxxxxxxxx');
      const resp = (popularSearches as any).default;
      // console.log('in mock-data.service -> /popular-searches, resp', resp);

      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      };

      return new Response(200, headers, resp);
    });

    server.get('/all-cuisines', () => {
      const resp = (cuisines as any).default;
      const headers = { 'Content-Type': 'application/json' };
      return new Response(200, headers, resp);
    });

    server.get('/cuisines-items', () => {
      const resp = (cuisinesItems as any).default;
      const headers = { 'Content-Type': 'application/json' };
      return new Response(200, headers, resp);
    });

    server.get('/items/:itemId', (schema, request) => {
      const resp = (itemPlaces as any).default;

      const headers = { 'Content-Type': 'application/json' };

      const size = request.queryParams['pageSize'] || 1;
      const num = request.queryParams['pageNum'] || 1;
      const itemId = request.params['itemId'];

      if (+num === 1) {
        console.log('mock-data.service returning ', { ...resp, id: itemId, places: resp.places.slice(0, 1) });
        return new Response(200, headers, { ...resp, id: itemId, places: resp.places.slice(0, 1) });
      }
      console.log('mock-data.service returning ', { ...resp, id: itemId, places: resp.places.slice(1, 2) });
      return new Response(200, headers, { ...resp, id: itemId, places: resp.places.slice(1, 2) });
    });
    server.get('/places/:placeId', (schema, request) => {
      const resp = (place as any).default;

      const headers = { 'Content-Type': 'application/json' };
      return new Response(200, headers, resp);

      // const size = request.queryParams['pageSize'] || 1;
      // const num = request.queryParams['pageNum'] || 1;
      //
      // if (+num === 1) {
      //   console.log('mock-data.service returning ', {...resp, places: resp.places.slice(0, 1)});
      //   return new Response(200, headers, {...resp, places: resp.places.slice(0, 1)});
      // }
      // console.log('mock-data.service returning ', {...resp, places: resp.places.slice(1, 2)});
      // return new Response(200, headers, {...resp, places: resp.places.slice(1, 2)});
    });

    server.get('/places/:placeId/items/:itemId', (schema, request) => {
      const resp = (itemInAPlace as any).default;

      const headers = { 'Content-Type': 'application/json' };
      return new Response(200, headers, resp);
    });

    server.get('/places/:placeId/items/:itemId/reviews', (schema, request) => {
      const page0 = (itemInAPlace as any).default;
      const page1 = (itemInAPlaceMoreReviews as any).default;

      const headers = { 'Content-Type': 'application/json' };

      const size = request.queryParams['pageSize'] || 1;
      const num = request.queryParams['pageNum'] || 1;

      if (+num <= 1) {
        // const firstItemKey = Object.keys(resp.items)[0];
        // console.log('mock-data.service returning ', {...resp, places: resp.items[firstItemKey].reviewsslice(0, 1)});
        return new Response(200, headers, page0);
      }

      return new Response(200, headers, page1);
    });

    server.post('/reviews', (schema, request) => {
      const headers = { 'Content-Type': 'application/json' };
      return new Response(200, headers, newReview);
    });

    server.get('/places/search', (schema, request) => {
      const headers = { 'Content-Type': 'application/json' };

      const name = request.queryParams['name'];
      if (!name) {
        return new Response(
          404,
          {},
          { error: 'Provide atleast 3 characters', description: 'Provide atleast 3 characters' },
        );
      }
      const postcode = request.queryParams['postcode'] || 2000;
      const city = request.queryParams['city'] || 'Sydney';
      const suburb = request.queryParams['suburb'] || 'The Ponds';

      return new Response(200, headers, placesAbc);
    });

    server.post('/medias/upload', (schema, request) => {
      const headers = { 'Content-Type': 'application/json' };
      const resp = (mediaResponse as any).default;
      console.log('mock-data.service printing requestBody', request.requestBody);
      console.log(
        'mock-data.service printing requestBody as unknown as FormData;',
        request.requestBody as unknown as FormData,
      );
      // const name = request.queryParams['name'];
      // if (!name) {
      //     return new Response(404, {}, {'error': 'Provide atleast 3 characters', 'description': 'Provide atleast 3 characters'})
      // }
      const postcode = request.requestHeaders['postcode'] || 2000;
      const city = request.queryParams['city'] || 'Sydney';
      const suburb = request.queryParams['suburb'] || 'The Ponds';

      return new Response(200, headers, resp);
    });

    server.post('/customers/oidc-login', (schema, request) => {
      const headers = { 'Content-Type': 'application/json' };
      const resp = (customer as any).default;
      console.log('mock-data.service POST /customers/oidc-login printing requestBody', request.requestBody);
      console.log(
        'mock-data.service printing requestBody as unknown as FormData;',
        request.requestBody as unknown as FormData,
      );

      return new Response(200, headers, resp);
    });

    server.post('/customers/:customerId/logout', (schema, request) => {
      const headers = { 'Content-Type': 'application/json' };
      console.log('mock-data.service POST /customers/:customerId/logout');
      console.log(
        'mock-data.service printing requestBody as unknown as FormData;',
        request.requestBody as unknown as FormData,
      );

      return new Response(HttpStatusCode.NoContent, headers);
    });
  }
}
