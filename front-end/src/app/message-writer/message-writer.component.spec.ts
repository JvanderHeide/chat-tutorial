import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageWriterComponent } from './message-writer.component';

describe('MessageWriterComponent', () => {
  let component: MessageWriterComponent;
  let fixture: ComponentFixture<MessageWriterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageWriterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
