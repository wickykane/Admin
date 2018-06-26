import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPanelService } from '../admin-panel.service';
import { TableService } from '../../../services/index';
import { routerTransition } from '../../../router.animations';
import { DocumentModalContent } from './modal/document.modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var jsPlumb: any;
declare var $: any;
declare var jQuery: any;

@Component({
    selector: 'work-flow',
    providers: [AdminPanelService],
    templateUrl: 'work-flow.edit.component.html',
    styleUrls: ['work-flow.component.scss'],
    animations: [routerTransition()]
})

export class WorkFlowEditComponent implements OnInit {
    constructor(
        private TableService: TableService,
        private activeRouter: ActivatedRoute,
        private router: Router,
        private AdminPanelService: AdminPanelService,
        private modalService: NgbModal) { }

    ngOnInit(): void {
        if (localStorage.getItem('chartData')) {
            this.dropOject = [];
            this.tempData = JSON.parse(localStorage.getItem('chartData'));
            this.loadChart();
        }

    }

    isCollapsedAction;
    isCollapsedCondition;
    isCollapsedInterActive;

    draggableActions = [{ name: 'Start', type: 3, }, { name: 'End', type: 4, }, { name: 'New Document', img: '../../../assets/img/icon-workflow/new-document.png' }, { name: 'Notify Document', img: '../../../assets/img/icon-workflow/Notify.png' }, { name: 'Read Document', img: '../../../assets/img/icon-workflow/Read.png' }, { name: 'Delete Document', img: '../../../assets/img/icon-workflow/delete.png' }, { name: 'Approve Document', img: '../../../assets/img/icon-workflow/new-document.png' }];
    draggableConditions = [{ name: 'Condition', type: 2, img: '../../../assets/img/icon-workflow/Condition.png' }, { name: 'Parallel', type: 2, img: '../../../assets/img/icon-workflow/Parallel.png' }];
    draggableInteractives = [{ name: 'Message', img: '../../../assets/img/icon-workflow/Message.png' }, { name: 'Set State Name', img: '../../../assets/img/icon-workflow/Set-State-name.png' }, { name: 'User Notification', img: '../../../assets/img/icon-workflow/User-notification.png' }, { name: 'Task', img: '../../../assets/img/icon-workflow/task.png' }];

    centerAnchor = true;
    dropOject = [];
    tempData = [];

    parentDragable = true;
    conditionMode = {
        flag: 0,
        data: null
    };

    currentIndex = 0;
    currentPrevObject = null;

    currentjsPlumb = jsPlumb.getInstance();

    common = {
        connector: ['Straight'],
        anchor: ['Bottom', 'Top'],
        endpoint: 'Blank'
    };

    condition = {
        2: {
            connector: ['Flowchart'],
            anchor: ['Left', 'Top'],
            endpoint: 'Blank'
        },
        1: {
            connector: ['Flowchart'],
            anchor: ['Right', 'Top'],
            endpoint: 'Blank'
        }
    }

    onDropComplete = function (data, event, id, item, flag, type?, reload?) {
        var data_id = id;
        data = Object.assign({}, data);
        if (flag) {
            data.parent = (type) ? id : '';
            data.id = data_id;
            data.item = item;
            data.flag = flag;
            data.type_condition = type;
            setTimeout(() => {
                this.dropOject.push(data);
            })

            this.parentDragable = false;
            if (data_id != null) {
                setTimeout(() => {
                    this.initArrow(jQuery('#object' + data_id), type, data);
                })
            } else {
                setTimeout(() => {
                    jQuery('#object0').css({ 'top': '100px' });
                })
            }

            return;
        }

        item.children = item.children || [];
        item.children.push(data);
        console.log(item.children)
    }

    initArrow(src, type, data) {
        this.currentPrevObject = src;
        var currentIndex = (this.dropOject.length - 1);

        var cur = jQuery('#object' + currentIndex);
        var jsConfig = this.common;

        if (type ===  'left') {
            cur.css({ 'left': src.offset().left - 305 });
            jsConfig = this.condition[2];
        } else
            if (type ===  'right') {
                cur.css({ 'left': src.offset().left + 90 });
                jsConfig = this.condition[1];
            } else {
                if (this.currentPrevObject) {
                    cur.css({ 'left': this.currentPrevObject.offset().left - 105 });
                }
            }

        // Set height position
        cur.css({ 'top': jQuery('.dropable-container').scrollTop() + src.offset().top - 100 });
        jQuery('.dropable-container-1').css('height', jQuery('.dropable-container').scrollTop() + cur.offset().top + 100);

        this.currentjsPlumb.ready(() => {
            this.currentjsPlumb.connect({
                source: src,
                target: cur,
                paintStyle: { stroke: 'lightgray', strokeWidth: 2, 'dashstyle': '2' },
                endpointStyle: { fillStyle: 'lightgray', outlineStroke: 'gray' },
                overlays: [
                    ['Arrow', { width: 12, length: 12, location: 0.5 }],
                    //  [ 'Label', { location:0.1, label:'Teooo',cssClass:'labell' } ],

                ]
            }, jsConfig);
            this.currentjsPlumb.draggable(cur, { containment: 'parent' });

        })




    }


    closeButton = function (index) {
        this.remove(index);

    }

    remove = function (index) {
        this.currentjsPlumb.remove('object' + index);
        this.dropOject.splice(index, 1);
        if (this.dropOject.length === 0) {
            this.parentDragable = true;
        }
        this.currentnode = (Number(index) || 1) - 1;
    }

    loadChart = function () {

        var loadData = this.tempData;
        loadData.map((data) => {
            setTimeout(() => {
                this.onDropComplete(data, null, data.id, data.item, data.flag, data.type_condition);
            }, 100)

        })
    }

    enterText = function (item) {
        item.hide = !item.hide;
    }

    saveChart = function () {
        this.tempData = this.dropOject;
        for (var i in this.dropOject) {
            this.currentjsPlumb.remove('object' + i);
        }
        localStorage.setItem('chartData', JSON.stringify(this.tempData));
        this.dropOject = [];
        this.parentDragable = true;
    }

    createTemplate = function () {
        this.dropOject = [];
        this.tempData = [];
        this.parentDragable = true;
    }

    openSetting() {
        const modalRef = this.modalService.open(DocumentModalContent, { size: 'lg' }) ;
        modalRef.result.then(data => {
        });
      }
}
