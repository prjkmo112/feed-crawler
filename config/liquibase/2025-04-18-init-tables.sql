create table datacrawler.datasource
(
    idx         int unsigned auto_increment
        primary key,
    title       varchar(128)                        not null comment '출처 이름',
    sourcekey   varchar(256)                        not null comment '고유 키 (구분을 위한)',
    type        enum ('xml', 'html', 'json', 'csv') not null,
    url         varchar(256)                        not null,
    description text                                null,
    icon        blob                                null,
    isActivate  tinyint(1)                          null,
    constraint uniq_sourcekey
        unique (sourcekey)
)
    comment '데이터 출처에 대한 정보' collate = utf8mb4_general_ci;


create table crawled_data
(
    idx         int unsigned auto_increment
        primary key,
    sourceIdx   int unsigned not null,
    datakey     varchar(128) not null,
    title       varchar(256) not null,
    url         varchar(256) not null,
    description varchar(256) null,
    content     text         null,
    pubDate     datetime     null,
    compressed  blob         not null,
    constraint crawled_data_pk
        unique (datakey),
    constraint crawled_data_datasource_idx_fk
        foreign key (sourceIdx) references datasource (idx)
)
    collate = utf8mb4_general_ci;

