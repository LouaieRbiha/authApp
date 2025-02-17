import { DashboardComponent } from './dashboard.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockService } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
describe('DashboardComponent', () => {
  let spectator: Spectator<DashboardComponent>;
  const authServiceMock: AuthService = MockService(AuthService);

  const createComponent = createComponentFactory({
    component: DashboardComponent,
    providers: [
      { provide: AuthService, useValue: authServiceMock },
      { provide: ActivatedRoute, useValue: { snapshot: {} } },
    ],
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should logout', () => {
    jest.spyOn(authServiceMock, 'logout');

    spectator.component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
