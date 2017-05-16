import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate'

import { PoisPage } from '../pois/pois';
import { ActivitiesPage } from '../activities/activities';

import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-municipi_detail',
  templateUrl: 'municipi-detail.html'
})

export class MunicipiDetailPage {
  municipi: any;
  favorite: boolean;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public userData: UserData, 
    public translate: TranslateService, 
    public events: Events) {
      this.municipi = this.navParams.data.municipi;
  }

  ionViewDidLoad() {
    this.favorite = this.userData.hasFavoriteMunicipis(this.municipi.ine);
  }

  goToPois(index: string) {
    this.navCtrl.push(PoisPage,{ine : this.municipi.ine});
  };

  goToActivities(index: string) {
    this.navCtrl.push(ActivitiesPage,{ine : this.municipi.ine});
  };

	addFavorite() {
    let msg_added = '';
    this.translate.get('MUNICIPIS.FAVORITE_ADDED', {value: this.municipi.municipi_nom}).subscribe((res: string) => {
        msg_added = res;
    });
    let msg_ok = '';
    this.translate.get('MUNICIPIS.OK').subscribe((res: string) => {
        msg_ok = res;
    });
    this.userData.addFavoriteMunicipis(this.municipi.ine);
    let alert = this.alertCtrl.create({
      message: msg_added,
      buttons: [{
        text: msg_ok,
        handler: () => {
          this.favorite = true;
        }
      }]
    });
    alert.present();
  }

  removeFavorite() {
    let title = '';
    this.translate.get('MUNICIPIS.REMOVE_FAVORITE').subscribe((res: string) => {
      title = res;
    });
    let msg_remove_favorites = '';
    this.translate.get('MUNICIPIS.REMOVE_FAVORITES', {value: this.municipi.municipi_nom}).subscribe((res: string) => {
        msg_remove_favorites = res;
    });
    let msg_cancel = '';
    this.translate.get('MUNICIPIS.CANCEL').subscribe((res: string) => {
        msg_cancel = res;
    });
    let msg_remove = '';
    this.translate.get('MUNICIPIS.REMOVE').subscribe((res: string) => {
        msg_remove = res;
    });
    let alert = this.alertCtrl.create({
      title: title,
      message: msg_remove_favorites,
      buttons: [
        {
          text: msg_cancel
        },
        {
          text: msg_remove,
          handler: () => {
            this.userData.removeFavoriteMunicipis(this.municipi.ine);
            this.favorite = false;
            this.events.publish('MunicipiDetailPage:removeFavorite', this.municipi);
          }
        }
      ]
    });
    alert.present();
  }
}
