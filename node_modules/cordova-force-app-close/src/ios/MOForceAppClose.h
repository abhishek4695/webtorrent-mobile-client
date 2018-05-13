#import <Cordova/CDVPlugin.h>

@interface MOForceAppClose : CDVPlugin {
}

// The hooks for our plugin commands
- (void)forceAppClose:(CDVInvokedUrlCommand *)command;

@end
