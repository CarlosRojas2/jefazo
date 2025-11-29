<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class RepairOrderArticle extends Model{
    protected $attributes=[
        'repair_order_id',
        'article_id',
        'quantity',
        'price'
    ];
}
