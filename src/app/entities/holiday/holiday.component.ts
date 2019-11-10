import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'op-holiday',
    templateUrl: './holiday.component.html',
    styleUrls: ['./holiday.component.css']
})
export class HolidayComponent implements OnInit {
    nothingToshowText: any = 'Nothing to show'; // "By default" => There are no events scheduled that day.
    colors: any = {
        red: {
            primary: '#ad2121',
            secondary: '#FAE3E3'
        },
        yellow: {
            primary: '#e3bc08',
            secondary: '#FDF1BA'
        }
    };
    actions: any[] = [
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            name: 'delete'
        },
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            name: 'edit'
        }
    ];
    events: any = [
        // {
        //     start: new Date('2019-05-25 00:00:00'),
        //     end: new Date('2019-05-29 00:00:00'),
        //     title: 'title event 1',
        //     color: this.colors.red,
        //     actions: this.actions
        // },
        // {
        //     start: new Date(),
        //     end: new Date(),
        //     title: 'title event 2',
        //     color: this.colors.yellow,
        //     actions: this.actions
        // }
    ];
    viewDate: Date = new Date();
    themecolor: any = '#0a5ab3';
    thisYear = new Date().getFullYear();

    ngOnInit() {
        const start = new Date(this.thisYear, 0, 1);
        const end = new Date(this.thisYear + 1, 0, 1);
        // const weekends = [];

        const day = _.clone(start);
        while (day < end) {
            const d = day.getDay();
            if (d === 0 || d === 6) {
                this.events.push({
                    start: new Date(day),
                    end: new Date(day),
                    title: (d === 0 ? 'Sunday' : 'Saturday'),
                    color: this.colors.red,
                    actions: this.actions
                });
            }
            day.setDate(day.getDate() + 1);
        }

        console.log('events : ', this.events);
    }

    eventClicked(event) {
        console.log(event);
    }

    actionClicked(event) {
        console.log('action', event.action);
        console.log('event', event.event);
        if (event.action === 'delete') {
            _.pull(this.events, event.event);
        }
    }
}
