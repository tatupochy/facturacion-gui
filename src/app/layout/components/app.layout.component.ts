import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from "../service/app.layout.service";
import { AppSidebarComponent } from "./sidebar/app.sidebar.component";
import { AppTopBarComponent } from './topbar/app.topbar.component';
import { ScrollService } from '../../main/service/scroll.service';

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent implements OnDestroy, OnInit {

    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    profileMenuOutsideClickListener: any;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    @ViewChild('mainContainer') mainContainer!: any;

    constructor(public layoutService: LayoutService, public renderer: Renderer2, public router: Router, private scrollService: ScrollService) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {

            this.addOutsideClickListeners();

            if (this.layoutService.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideMenu();
                this.hideProfileMenu();
            });

        this.layoutService.state.staticMenuDesktopInactive = false;
    }


    ngOnInit() {
        this.scrollService.scrollToTop$.subscribe(() => {
            this.mainContainer?.nativeElement.scrollTo(0, 0);
        });
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    hideProfileMenu() {
        this.layoutService.state.profileSidebarVisible = false;
        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener();
            this.profileMenuOutsideClickListener = null;
        }
    }

    isClickOutside(event: MouseEvent, elements: Array<any>): boolean {
        return !elements.some(el => el.nativeElement === event.target || el.nativeElement.contains(event.target));
    }
    
    addOutsideClickListeners(): void {
        if (!this.menuOutsideClickListener) {
            this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                if (this.isClickOutside(event, [this.appSidebar.el, this.appTopbar.menuButton.el])) {
                    this.hideMenu();
                }
            });
        }
    
        if (!this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                if (this.isClickOutside(event, [this.appTopbar.menu, this.appTopbar.topbarMenuButton.el])) {
                    this.hideProfileMenu();
                }
            });
        }
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        }
        else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        }
        else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.layoutService.config.colorScheme === 'light',
            'layout-theme-dark': this.layoutService.config.colorScheme === 'dark',
            'layout-overlay': this.layoutService.config.menuMode === 'overlay',
            'layout-static': this.layoutService.config.menuMode === 'static',
            'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config.menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'p-input-filled': this.layoutService.config.inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config.ripple
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
