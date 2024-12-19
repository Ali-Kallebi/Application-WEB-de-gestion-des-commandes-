import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UserService } from './demo/service/user.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['isLoggedIn']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: UserService, useValue: userServiceSpyObj }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when user is logged in', () => {
    userServiceSpy.isLoggedIn.and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
  });

  it('should navigate to /auth/login and return false when user is not logged in', () => {
    userServiceSpy.isLoggedIn.and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');
    expect(guard.canActivate()).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });
});
