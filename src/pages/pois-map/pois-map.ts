import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController, Platform, Events } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';

import { TranslateService } from 'ng2-translate/ng2-translate'

import { PoisFilterPage } from '../pois-filter/pois-filter';
import { PoisDetailPage } from '../pois-detail/pois-detail';

import { OpenData } from '../../providers/open-data';
import { ParamsData } from '../../providers/params-data';

@Component({
  selector: 'page-pois-map',
  templateUrl: 'pois-map.html'
})

export class PoisMapPage {
  private ine;
  private lastIne = '';
  private queryText = '';
  private lastQueryText = '';
	private data: any = [];
  private shownData: any = [];
  private total: number;
  private category: string;
  private lastCategory = '';
  private excludedDatasetsNames: any = [];
  private lastExcludedDatasetsNames: any = [];
  private map: GoogleMap;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController, 
    public modalCtrl: ModalController,
    public paramsData: ParamsData,
    public openData: OpenData,
    public translate: TranslateService,
    public platform: Platform,
    public events: Events,
    private googleMaps: GoogleMaps
  ) {
    this.ine = paramsData.params.ine;
    /*platform.ready().then(() => {
            this.loadMap();
    });*/
  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
  }

  ionViewDidLoad() {    
    this.events.subscribe('menu:opened', () => {
      this.map.setClickable(false);
    });

    this.events.subscribe('menu:closed', () => {
      this.map.setClickable(true);
    });
	}

  loadMap() {
    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    this.map = this.googleMaps.create(element);
 
    /*this.map = new GoogleMap('map', {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': location,
        'tilt': 30,
        'zoom': 15,
        'bearing': 50
      }
    });*/

    /*this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
        console.log('Map is ready!');
    });*/

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    this.map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker
      }
    );

    // create LatLng object
    let location: LatLng = new LatLng(41.5777099,1.6122413); //Igualada

    // create CameraPosition
    let position: CameraPosition = {
      target: location,
      zoom: 18,
      tilt: 30
    };

    // move the map's camera to position
    this.map.moveCamera(position);

    // create new marker
    let markerOptions: MarkerOptions = {
      position: location,
      title: 'Ionic'
    };

    const marker: any = this.map.addMarker(markerOptions)
      .then((marker: Marker) => {
          marker.showInfoWindow();
        });
 
  }

  updateMap() {
  }

  presentFilter() {
    this.map.setClickable(false);
    let modal = this.modalCtrl.create(PoisFilterPage, {
      ine: this.ine,
      category: this.category,
      excludedDatasetsNames: this.excludedDatasetsNames
    });
    modal.present();

    modal.onWillDismiss((data: any) => {
      this.map.setClickable(true);
      if (data) {
        this.ine = data.ine;
        this.category = data.category;
        this.excludedDatasetsNames = data.excludedDatasetsNames;
        this.updateMap();
      }
    });
  }

}
