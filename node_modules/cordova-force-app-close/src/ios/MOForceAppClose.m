#import "MOForceAppClose.h"

#import <Cordova/CDVAvailability.h>

@implementation MOForceAppClose

- (void)pluginInitialize {
}

- (void)forceAppClose:(CDVInvokedUrlCommand *)command {
  exit(0);
}

@end
