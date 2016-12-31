#include <stdlib.h>

int main() {
	while(1) {
		int ret = system("ping -w 1 -c 1 www.google.com");
		sleep(1);
	}
	return 1;
}
