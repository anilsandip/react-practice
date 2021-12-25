<?php

namespace App\Jobs;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Osiset\ShopifyApp\Actions\CancelCurrentPlan;
use Osiset\ShopifyApp\Contracts\Commands\Shop as IShopCommand;
use Osiset\ShopifyApp\Contracts\Queries\Shop as IShopQuery;
use Osiset\ShopifyApp\Messaging\Jobs\AppUninstalledJob as OsisetAppUninstalledJob;


class AppUninstalledJob extends OsisetAppUninstalledJob
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @return void
     */
    public $domain;

    /**
     * @param $domain
     */
    public function __construct($domain)
    {
        $this->domain = $domain;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(IShopCommand $shopCommand,IShopQuery $shopQuery,CancelCurrentPlan $cancelCurrentPlanAction): bool
    {
        $shop = User::where('name', $this->domain)->firstOrFail();
        OsisetAppUninstalledJob::handle($shopCommand, $shopQuery,$cancelCurrentPlanAction);
        $shop->forceDelete();

        return true;
    }
}
