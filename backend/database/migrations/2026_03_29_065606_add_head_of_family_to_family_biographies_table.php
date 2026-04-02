<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('family_biographies', function (Blueprint $table) {
            $table->string('head_of_family')->nullable()->after('partner_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('family_biographies', function (Blueprint $table) {
            $table->dropColumn('head_of_family');
        });
    }
};
