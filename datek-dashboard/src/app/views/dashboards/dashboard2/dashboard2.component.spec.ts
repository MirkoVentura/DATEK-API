import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { StatsCardComponent } from '../common/stats-card/stats-card.component';
import { Dashboard2Component } from './dashboard2.component';

describe('Dashboard2Component', () => {
    let component: Dashboard2Component;
    let fixture: ComponentFixture<Dashboard2Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Dashboard2Component,
                StatsCardComponent
            ],
            schemas: [
                NO_ERRORS_SCHEMA,
                CUSTOM_ELEMENTS_SCHEMA
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Dashboard2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
